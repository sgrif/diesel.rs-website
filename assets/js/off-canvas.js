const body = document.body;
const offCanvas = document.querySelector('#off-canvas-model')

const leftSidebar = document.querySelector('#left-sidebar')
const leftSidebarOpen = document.querySelector('#left-sidebar-open-button')
const leftSidebarClose = document.querySelector('#left-sidebar-close-button')

if (leftSidebar && leftSidebarOpen) {
    leftSidebarOpen.addEventListener('click', function () {
        body.classList.add('model-open')
        offCanvas.style.display = 'block'
        leftSidebar.classList.add('open')

        leftSidebarClose.addEventListener('click', function () {
            body.classList.remove('model-open')
            offCanvas.style.display = 'none'
            leftSidebar.classList.remove('open')
        });

        offCanvas.addEventListener('click', function () {
            body.classList.remove('model-open')
            offCanvas.style.display = 'none'
            leftSidebar.classList.remove('open')
        });
    });
}

const rightSidebar = document.querySelector('#right-sidebar')
const rightSidebarOpen = document.querySelector('#right-sidebar-open-button')
const rightSidebarClose = document.querySelector('#right-sidebar-close-button')

if (rightSidebar && rightSidebarOpen) {
    rightSidebarOpen.addEventListener('click', function () {
        body.classList.add('model-open')
        offCanvas.style.display = 'block'
        rightSidebar.classList.add('open')

        rightSidebarClose.addEventListener('click', function () {
            body.classList.remove('model-open')
            offCanvas.style.display = 'none'
            rightSidebar.classList.remove('open')
        });

        offCanvas.addEventListener('click', function () {
            body.classList.remove('model-open')
            offCanvas.style.display = 'none'
            rightSidebar.classList.remove('open')
        });
    });
}

window.addEventListener('resize', function (event) {
    if (body.classList.contains('model-open')) {
        body.classList.remove('model-open')
        offCanvas.style.display = 'none'

        if (rightSidebar.classList.contains('open')) {
            rightSidebar.classList.remove('open')
        }

        if (leftSidebar.classList.contains('open')) {
            leftSidebar.classList.remove('open')
        }
    }
});

const section = window.location.pathname.split('/').filter(Boolean)[0] || 'default';
const sectionSidebarPositionKey = `${section}-sidebar-position`;
const siteHeader = document.querySelector('#site-header')
const leftSidebarActiveItem = document.querySelector('#left-sidebar-nav > details > ul > li > a.active');

window.addEventListener('DOMContentLoaded', () => {
    const savedScroll = sessionStorage.getItem(sectionSidebarPositionKey);
    if (savedScroll === null) {
        const sidebarRect = leftSidebar.getBoundingClientRect();
        const itemRect = leftSidebarActiveItem.getBoundingClientRect();

        const isVisible =
            itemRect.top >= sidebarRect.top &&
            itemRect.bottom <= sidebarRect.bottom;

        if (!isVisible) {
            leftSidebar.scrollTo({
                top: leftSidebarActiveItem.offsetTop - sidebarRect.offsetTop - siteHeader.getBoundingClientRect().height,
                behavior: "auto"
            });
        }
    } else {
        leftSidebar.scrollTop = parseInt(savedScroll, 10);
    }
});

window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(sectionSidebarPositionKey, leftSidebar.scrollTop);
});