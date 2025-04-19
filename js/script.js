// Define the content data for each category
const categoryContent = {
    'animals': {
        title: 'Dragon',
        items: [
            {
                title: 'Dragon',
                images: ['images1/5.png', 'images1/6.png'],
                description: "Loong's paper-cut has rich moral and symbolic significance. Dragon is a symbol of the Chinese nation, representing authority, dignity and happiness."
            },
            {
                title: 'Rabbit',
                images: ['images1/7.png', 'images1/8.png'],
                description: "Rabbit paper-cut:In China, the rabbit itself has a beautiful implication of extreme accumulation and kindness.So people usually think that the rabbit represents transcendence and progress."
            },
            {
                title: 'Mouse',
                images: ['images1/9.png', 'images1/10.png'],
                description: "It is regarded as a symbol of alertness, good handling of adversity, reproduction of descendants and prosperity of family business. It has the auspicious meaning of endless growth and prosperity."
            }
        ]
    },
    'architecture': {
        title: 'Architecture',
        items: [
            {
                title: 'City',
                images: ['images1/11.png', 'images1/12.png'],
                description: "Urban paper-cut art depicts people's deeds and calls for caring and helping the vulnerable groups in society."
            },
            {
                title: 'Temple',
                images: ['images1/13.png', 'images1/14.png'],
                description: "Paper-cut is a traditional skill in China, which combines traditional skills with handmade buildings to extend more beautiful works of art."
            },
            {
                title: 'Scenic Spot',
                images: ['images1/15.png', 'images1/16.png'],
                description: "The buildings with carved beams and painted pillars in the scenic spot are transformed into exquisite papercuts, and the picture details full of immortal charm unfold slowly, showing their beautiful appearance."
            }
        ]
    },
    'portrait': {
        title: 'Portrait',
        items: [
            {
                title: 'Cut Child',
                images: ['images1/17.png', 'images1/18.png'],
                description: "A cute paper-cut child holds the character 'Fu' and brings good luck. Flowers bloom all around, and good fortune arrives. Traditional craftsmanship adds a festive atmosphere. May you be filled with blessings in the new year."
            },
            {
                title: 'Superhero',
                images: ['images1/19.png'],
                description: "The Avengers portrait paper-cut, each one seems to be telling the legendary story of heroes. Presented in the form of paper-cutting, it contains the traditional culture of China and coincides with the passionate spirit of superheroes to protect the world."
            },
            {
                title: 'Journey to the West',
                images: ['images1/20.png', 'images1/21.png'],
                description: "This group of paper-cuts introduces one of the characters in The Journey to the West, one of China's four classical novels-four Tang Priests and Mentors. Each character is endowed with unique charm by paper cutting, presenting traditional fairy tales in a dramatic form."
            }
        ]
    },
    'window-grilles': {
        title: 'Window Grilles',
        items: [
            {
                title: 'Fish',
                images: ['images1/22.png', 'images1/23.png'],
                description: "The fish in the paper cut symbolizes prosperity, good fortune, prosperity, and symbolizes wealth, love, congeniality, a bright future and luck."
            },
            {
                title: 'Flower',
                images: ['images1/24.png', 'images1/25.png'],
                description: "The meaning of flowers refers to the flower-like, open and high sense of beauty. Flowers, which is usually used to describe the blooming flowers in spring, and can also be used to describe the prosperity of things."
            },
            {
                title: "New Year's Flowers",
                images: ['images1/26.png', 'images1/27.png'],
                description: "It can decorate the walls of the living space and convey good wishes and implications. If symbolized in the new year can be full of happiness and joy."
            }
        ]
    }
};

// Carousel Logic
let slideIndex = 1;

document.addEventListener('DOMContentLoaded', function() {
    // Check if it is on the detail.html page
    const isDetailPage = document.querySelector('.detail-container') !== null;
    
    if (isDetailPage) {
        // Get the category parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            // Get all navigation items
            const categoryItems = document.querySelectorAll('.category-nav .category-item');
            
            // Find the corresponding navigation item and activate it
            categoryItems.forEach(item => {
                if (item.textContent.toLowerCase().replace(' ', '-') === category) {
                    // Remove all active classes
                    categoryItems.forEach(i => i.classList.remove('active'));
                    // Add the active class of the current item
                    item.classList.add('active');
                    
                    // Update page title
                    const detailTitle = document.querySelector('.detail-title');
                    if (detailTitle && categoryContent[category]) {
                        detailTitle.textContent = categoryContent[category].title;
                    }
                    
                    // Update content
                    updateTimelineContent(category);
                }
            });
        }
        
        // Get all navigation items
        const categoryItems = document.querySelectorAll('.category-nav .category-item');
        const timelineContainer = document.querySelector('.timeline-container');

        // Add a click event for each navigation item
        categoryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove all active classes
                categoryItems.forEach(i => i.classList.remove('active'));
                // Add the active class of the current item
                this.classList.add('active');
                
                // Get the current category
                const category = this.textContent.toLowerCase().replace(' ', '-');
                
                // Update URL parameters without refreshing the page
                const url = new URL(window.location.href);
                url.searchParams.set('category', category);
                window.history.pushState({}, '', url);
                
                // Update page title
                const detailTitle = document.querySelector('.detail-title');
                if (detailTitle) {
                    detailTitle.textContent = categoryContent[category].title;
                }
                
                // Update content
                updateTimelineContent(category);
            });
        });
    } else {
        // Home page logic
        // Initialize the carousel
        showSlides(slideIndex);
        
        // Autoplay
        setInterval(function() {
            plusSlides(1);
        }, 5000);
        
        // Add click event to type-card
        const typeCards = document.querySelectorAll('.type-card');
        typeCards.forEach(card => {
            const typeLink = card.querySelector('.type-link');
            if (typeLink) {
                typeLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const category = this.getAttribute('data-category');
                    if (category) {
                        window.location.href = `detail.html?category=${category}`;
                    }
                });
            }
            
            // hover effect
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Add click effects to navigation menu items
        const navItems = document.querySelectorAll('.main-nav a');
        
        // Get the hash value of the current page
        const currentHash = window.location.hash || '#daily-recommendations';
        
        // Set the initial activation state according to the hash value
        navItems.forEach(item => {
            if (item.getAttribute('href') === currentHash) {
                item.classList.add('active');
                
                // Scroll to the corresponding position
                setTimeout(() => {
                    const targetElement = document.querySelector(currentHash);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 20,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        });
        
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove all activations
                navItems.forEach(i => i.classList.remove('active'));
                // Add the activation state of the current item
                this.classList.add('active');
                
                // Smooth scrolling to target position
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 20,
                        behavior: 'smooth'
                    });
                    
                    // Update the URL hash value without triggering scrolling
                    history.pushState(null, null, targetId);
                }
            });
        });
        
        // Recommended card hover effect
        const recommendationCard = document.querySelector('.recommendation-card');
        
        if (recommendationCard) {
            recommendationCard.addEventListener('mouseenter', function() {
                this.querySelector('.card-overlay').style.opacity = '1';
            });
            
            recommendationCard.addEventListener('mouseleave', function() {
                this.querySelector('.card-overlay').style.opacity = '0.8';
            });
        }
    }
});

// Function to update the timeline content
function updateTimelineContent(category) {
    // Get the timeline container inside the function
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return; // security check
    
    const items = categoryContent[category].items;
    let html = '';
    
    items.forEach((item, index) => {
        // Treat each item as a normal item and include the title directly in the content
        html += `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-dot"></div>
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h3 class="animal-title">${item.title}</h3>
                    <div class="paper-cut-image">
                        <img src="${item.images[0]}" alt="${item.title} Paper Cutting">
                    </div>
                    ${item.images.length > 1 ? `
                    <div class="paper-cut-image">
                        <img src="${item.images[1]}" alt="${item.title} Paper Cutting">
                    </div>
                    ` : ''}
                    <p class="paper-cut-description">
                        ${item.description}
                    </p>
                </div>
            </div>
        `;
    });
    
    timelineContainer.innerHTML = `<div class="timeline-line"></div>${html}`;
    
    // For PC, add necessary styles after loading the content to ensure two items per row
    if (window.innerWidth >= 1200) {
        const allItems = timelineContainer.querySelectorAll('.timeline-item');
        allItems.forEach(item => {
            item.style.backgroundColor = 'white';
            item.style.borderRadius = '15px';
            item.style.padding = '25px';
            item.style.marginBottom = '0';
            item.style.width = 'calc(50% - 15px)';
            item.style.flex = '0 0 calc(50% - 15px)';
            item.style.boxSizing = 'border-box';
            item.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
            
            const paperCutImages = item.querySelectorAll('.paper-cut-image');
            paperCutImages.forEach(img => {
                img.style.height = '200px';
                img.style.display = 'flex';
                img.style.justifyContent = 'center';
                img.style.alignItems = 'center';
                img.style.backgroundColor = 'white';
                img.style.marginBottom = '15px';
                
                const actualImg = img.querySelector('img');
                if (actualImg) {
                    actualImg.style.maxHeight = '180px';
                    actualImg.style.objectFit = 'contain';
                }
            });
            
            const description = item.querySelector('.paper-cut-description');
            if (description) {
                description.style.textAlign = 'center';
                description.style.fontSize = '16px';
                description.style.lineHeight = '1.7';
                description.style.color = '#444';
                description.style.marginTop = '10px';
            }
            
            const title = item.querySelector('.animal-title');
            if (title) {
                title.style.display = 'inline-block';
                title.style.fontSize = '26px';
                title.style.backgroundColor = 'white';
                title.style.color = '#7f1818';
                title.style.padding = '8px 35px';
                title.style.borderRadius = '50px';
                title.style.margin = '0 auto 20px';
                title.style.boxShadow = '0 3px 10px rgba(0,0,0,0.05)';
                title.style.textAlign = 'center';
                title.style.width = 'fit-content';
                title.style.display = 'block';
            }
        });
        
        // Set container style
        timelineContainer.style.display = 'flex';
        timelineContainer.style.flexWrap = 'wrap';
        timelineContainer.style.justifyContent = 'center';
        timelineContainer.style.gap = '30px';
    }
}

// front and rear control
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Current control
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    
    if (!slides.length) return; // If the page does not have a slideshow element, return directly
    
    // Handling index out of bounds
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Removes the activation status of all navigation points
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Displays the current slide and activates the corresponding navigation point
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
} 
