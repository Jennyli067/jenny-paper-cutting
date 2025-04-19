document.addEventListener('DOMContentLoaded', function() {
    let startY;
    let currentY;
    let currentPage = window.location.pathname.split('/').pop() || 'guide.html';
    let isAnimating = false;
    let touchStartTime;
    let isAtBottom = false;
    let lastScrollTop = 0;
    let overscrollDistance = 0;
    
    console.log('当前页面:', currentPage);
    
    if (currentPage === 'guide.html') {
        localStorage.removeItem('currentGuidePage');
    }

    // 添加点击事件监听（用于前两个页面的切换）
    if (currentPage === 'guide.html' || currentPage === 'guide1.html') {
        document.addEventListener('click', function(e) {
            console.log('点击事件触发');
            if (!isAnimating) {
                console.log('准备执行页面切换');
                handlePageTransition(true);
            }
        });
    }

    // 添加滚动进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    // 监听滚动事件
    if (currentPage === 'guide2.html') {
        const firstPage = document.querySelector('.page');
        const lastPage = document.querySelector('.last-page');
        const scrollHint = document.querySelector('.scroll-hint');
        const progressBarFill = document.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // 检查是否到达底部
            isAtBottom = scrollPosition + windowHeight >= documentHeight - 20;
            console.log('滚动状态:', {
                scrollPosition,
                windowHeight,
                documentHeight,
                isAtBottom
            });
            
            // 更新进度条
            const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
            progressBarFill.style.width = scrollPercentage + '%';

            // 检查滚动方向和位置
            const scrollingDown = scrollPosition > lastScrollTop;
            const nearBottom = scrollPosition + windowHeight >= documentHeight - 50;
            
            // 更新页面可见性
            if (scrollingDown && scrollPosition > windowHeight * 0.3) {
                firstPage.classList.add('hidden');
                lastPage.classList.add('visible');
                if (scrollHint) scrollHint.classList.add('fade-out');
            } else if (!scrollingDown && scrollPosition < windowHeight * 0.7) {
                firstPage.classList.remove('hidden');
                lastPage.classList.remove('visible');
                if (scrollHint) scrollHint.classList.remove('fade-out');
            }

            // 更新底部状态
            isAtBottom = nearBottom;
            
            // 显示/隐藏上滑提示
            if (isAtBottom) {
                showSwipeHint();
            } else {
                hideSwipeHint();
            }

            lastScrollTop = scrollPosition;
        });
    }

    // 触摸事件处理
    document.addEventListener('touchstart', function(e) {
        console.log('触摸开始:', {
            isAnimating,
            currentPage,
            isAtBottom
        });
        
        if (isAnimating || currentPage !== 'guide2.html') return;
        startY = e.touches[0].clientY;
        currentY = startY;
        touchStartTime = Date.now();
        overscrollDistance = 0;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!startY || isAnimating || currentPage !== 'guide2.html') return;
        
        currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        console.log('触摸移动:', {
            deltaY,
            isAtBottom,
            startY,
            currentY
        });
        
        // 只有在到达底部后才处理上拉
        if (isAtBottom && deltaY > 0) {
            e.preventDefault();
            overscrollDistance = deltaY;
            
            // 添加阻尼效果
            const dampenedDistance = Math.min(deltaY * 0.5, window.innerHeight * 0.3);
            document.body.style.transform = `translateY(-${dampenedDistance}px)`;
            
            console.log('上拉状态:', {
                overscrollDistance,
                dampenedDistance,
                threshold: window.innerHeight * 0.2
            });
            
            // 更新加载提示的位置和状态
            updateLoadingHint(dampenedDistance);
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (!startY || isAnimating || currentPage !== 'guide2.html') return;
        
        const endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;
        const touchDuration = Date.now() - touchStartTime;
        const velocity = Math.abs(deltaY) / touchDuration;
        
        console.log('触摸结束:', {
            deltaY,
            isAtBottom,
            overscrollDistance,
            threshold: window.innerHeight * 0.2,
            shouldTransition: isAtBottom && overscrollDistance > window.innerHeight * 0.2
        });
        
        if (isAtBottom && overscrollDistance > window.innerHeight * 0.2) {
            console.log('准备跳转到首页');
            handlePageTransition(true);
        } else {
            // 回弹动画
            document.body.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            document.body.style.transform = '';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        }
        
        startY = null;
        currentY = null;
        overscrollDistance = 0;
    });

    function showSwipeHint() {
        const existingHint = document.querySelector('.swipe-hint');
        if (!existingHint) {
            const hint = document.createElement('div');
            hint.className = 'swipe-hint';
            hint.innerHTML = `
                <div class="gesture-hint"></div>
                <div class="swipe-text">继续上拉进入首页</div>
            `;
            document.body.appendChild(hint);
            setTimeout(() => hint.classList.add('show'), 100);
        }
    }

    function hideSwipeHint() {
        const hint = document.querySelector('.swipe-hint');
        if (hint) {
            hint.classList.remove('show');
            setTimeout(() => hint.remove(), 300);
        }
    }

    function updateLoadingHint(distance) {
        const hint = document.querySelector('.swipe-hint');
        if (hint) {
            const progress = Math.min(distance / (window.innerHeight * 0.2), 1);
            hint.style.opacity = Math.min(0.8 + progress * 0.2, 1);
            
            const text = hint.querySelector('.swipe-text');
            if (text) {
                if (progress >= 1) {
                    text.textContent = '松开进入首页';
                } else {
                    text.textContent = '继续上拉进入首页';
                }
            }
        }
    }

    function handlePageTransition(isForward) {
        console.log('执行页面跳转');
        if (isAnimating) {
            console.log('动画正在进行中，跳过跳转');
            return;
        }
        isAnimating = true;
        
        // 根据当前页面决定跳转目标和动画效果
        let nextPage;
        let transitionClass;
        
        switch (currentPage) {
            case 'guide.html':
                nextPage = 'guide1.html';
                transitionClass = 'page-turn';
                break;
            case 'guide1.html':
                nextPage = 'guide2.html';
                transitionClass = 'fade';
                break;
            case 'guide2.html':
                nextPage = 'index.html';
                transitionClass = 'slide-up';
                break;
            default:
                return;
        }
        
        console.log('跳转到:', nextPage, '使用动画:', transitionClass);
        document.body.classList.add(`${transitionClass}-exit`);
        
        setTimeout(() => {
            console.log('准备跳转到', nextPage);
            window.location.href = nextPage;
        }, 600);
    }
}); 