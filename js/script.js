window.addEventListener('DOMContentLoaded', function () {
    
    'use strict';

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

        //функция для скрытия неактивных табов
        function hideTabContent(a) {
            for (let i = a; i < tabContent.length; i++) {
                tabContent[i].classList.remove('show');
                tabContent[i].classList.add('hide');
            }
        }

        hideTabContent(1);

        //функция для показа табов при нажатии соотв. пункта меню
        function showTabContent(b) {
            if(tabContent[b].classList.contains('hide')) {
                tabContent[b].classList.remove('hide');
                tabContent[b].classList.add('show');
            }
        }
        //часть для определения связи между меню табов и самими табами
        info.addEventListener('click', function(event) {
            let target = event.target;
            if (target && target.classList.contains('info-header-tab')) {
                for (let i = 0; i < tab.length; i++) {
                    if (target == tab[i]) {
                        hideTabContent(0);
                        showTabContent(i);
                        break;
                    }
                }
            }
        });

        //Таймер
        let deadline = '2024-12-21';

        function getTimeRemaining (endtime) {
            let t = Date.parse(endtime) - Date.parse(new Date()),
                seconds = Math.floor((t/1000) % 60),
                minutes = Math.floor((t/1000/60) % 60),
                hours = Math.floor(t/(1000*60*60));

                return {
                    'total' : t,
                    'hours' : hours,
                    'minutes' : minutes,
                    'seconds' : seconds

                };
        }
        function setClock(id, endtime) {
            let timer = document.getElementById(id),
                hours = timer.querySelector('.hours'),
                minutes = timer.querySelector('.minutes'),
                seconds = timer.querySelector('.seconds'),
                timeInterval = setInterval(updateClock, 1000);

                function updateClock() {
                    let t = getTimeRemaining(endtime);
                    hours.textContent = t.hours;
                    minutes.textContent = t.minutes;
                    seconds.textContent = t.seconds;

                    if (t.total <= 0) {
                        clearInterval(timeInterval);
                    }
                }
        }

        setClock('timer', deadline);

        
        //Модальное окно
        let more = document.querySelector('.more'),
            overlay = document.querySelector('.overlay'),
            close = document.querySelector('.popup-close');

        more.addEventListener('click', function() {
            overlay.style.display = 'block';
            this.classList.add('more-splash');
            document.body.style.overflow ='hidden';//запрет прокрутки страницы за открытым модальным окном
        });

        close.addEventListener('click', function() {
            overlay.style.display = 'none';
            more.classList.remove('more-splash');
            document.body.style.overflow ='';     
        });

        
        //Отправка формы
        let message = {
            loading: 'Dowloading...',
            success: 'Thanks! We are connecting with you soon',
            failure: 'Something wrong...'
        };

        let form = document.querySelector('.main-form'),
            input = form.getElementsByTagName('input'),
            statusMessage = document.createElement('div');

            statusMessage.classList.add('status');

        form.addEventListener('submit', function(event){
            event.preventDefault();
            form.appendChild(statusMessage);

            let request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            let formData = new FormData(form);

            //преобразование данных в JSON-формат (для node.js и т.п.)
            let obj = {};
            formData.forEach(function(value, key) {
                obj[key] = value;
            });
            let json = JSON.stringify(obj);

            request.send(json);

            request.addEventListener('readystatechange', function() {
                if (request.readyState < 4) {
                    statusMessage.innerHTML = message.loading;
                } else if (request.readyState === 4 && request.status == 200) {
                    statusMessage.innerHTML = message.success;
                } else {
                    statusMessage.innerHTML = message.failure;
                }
            });

            for(let i = 0; i < input.length; i++) {
                input[i].value = '';
            }

        });

        
        //слайдер
        let slideIndex = 1, //первый слайд
            slides = document.querySelectorAll('.slider-item'), //каждый слайд
            prev = document.querySelector('.prev'), //навигация назад
            next = document.querySelector('.next'), //навигация вперед
            dotsWrap = document.querySelector('.slider-dots'), //обертка точек
            dots = document.querySelectorAll('.dot'); //каждая точка

            showSlides(slideIndex);

            function showSlides(n) {
                
                if (n > slides.length) {
                    slideIndex = 1;
                }
                if (n < 1) {
                    slideIndex = slides.length;
                }
                
                slides.forEach((item) => item.style.display = 'none');
                dots.forEach((item) => item.classList.remove('dot-active'));

                slides[slideIndex - 1].style.display = 'block';
                dots[slideIndex - 1].classList.add('dot-active');
            }

            function plusSlides(n) {
                showSlides(slideIndex += n);
            }
            function currentSlide(n) {
                showSlides(slideIndex = n);
            }

            prev.addEventListener('click', function(){
                plusSlides(-1);
            });

            next.addEventListener('click', function(){
                plusSlides(1);
            });

            dotsWrap.addEventListener('click', function(event) {
                for (let i = 0; i < dots.length + 1; i++) {
                    if (event.target.classList.contains('dot') && event.target == dots[i - 1]) {
                        currentSlide(i);
                    }
                }
            });
});
