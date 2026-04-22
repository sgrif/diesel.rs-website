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
