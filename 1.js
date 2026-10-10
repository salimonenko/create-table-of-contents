<script type="text/javascript">
// Функция ищет все теги, контент которых начинается с цифр, пробельных символов или точек; и который удовлетворяет некоторому условию (например, содержит определенный атрибут). Затем создает справа страницы всп. окно, содержащее перечень таких тегов и устанавливает обработчик клика. По клику на соответствующий тег страницу медленно прокрутится так, что он будет сверху экрана
/* <!-- [CDATA [*/
(function () {
/*********  ЭТИ ПАРАМЕТРЫ МОЖНО ИЗМЕНЯТЬ, В ЗАВИСИМОСТИ ОТ СТРАНИЦЫ, НА КОТОРОЙ РАСПОЛОЖЕН ЭТОТ СКРИПТ   (Начало)  *****/
    var idd = 'content_razn'; // id тега, внутри которого будут искаться теги оглавления
    var val = '&sect;'; // Первый символ текстового контента тега - признак пункта оглавления (если такой символ есть, то включаем соответствующий текст в оглавление)   (СИМВОЛ ПАРАГРАФА)
    var attr = ''; // Пока не используется
    var oglavl_cssText = 'position: fixed; top: 10%; right: 0px; z-index: 1; '; // CSS-параметры для размещения оглавления на странице
/*********  /ЭТИ ПАРАМЕТРЫ МОЖНО ИЗМЕНЯТЬ, В ЗАВИСИМОСТИ ОТ СТРАНИЦЫ, НА КОТОРОЙ РАСПОЛОЖЕН ЭТОТ СКРИПТ   (Конец)  *****/

        val = decodeHTMLEntities(val); // Превращаем html-сущность в символ (литерал)

    var main_cont = document.getElementById(idd);

    var div = document.createElement('div');
    var html_w = document.documentElement.clientWidth;
        div.style.cssText = oglavl_cssText;

    var div_w = parseInt(html_w) - (parseInt(offsetPosition(main_cont)[0]) + parseInt(getComputedStyle(main_cont).width)) + 'px';
        div.style.width = div_w;


    var butt = document.createElement('div');
        butt.style.cssText = 'z-index: 1; position: relative; float: right; padding: 2px 0; height: 30px; width: 30px; text-align: center; background-color: #FF5C5C; font-size: 26px; cursor: pointer;';
        butt.title = 'Свернуть';
        butt.innerHTML = '-';

        div.appendChild(butt);

    var div2 = butt.cloneNode(false); // Обтекаемая распорка
        div2.style.backgroundColor = 'transparent';
        div2.title = '';
        div2.style.zIndex = '';


    var div1 = document.createElement('div');
        div1.style.cssText = 'overflow: auto; max-height: 80vh; position: absolute; border: 1px solid; background-color: white; box-shadow: 0px 0px 38px 18px #8C8C8C;';
        div.appendChild(div1);

        div1.appendChild(div2);

    var div3 = document.createElement('div'); // Контейнер для пунктов меню
        div1.appendChild(div3);

    document.body.appendChild(div);

    div.onclick = function (e) {

        var nodes = div3.getElementsByTagName('*'); // На момент клика по пункту СТАРОГО меню (с перечнем пунктов) div3 уже будет существовать
        var index = Array.prototype.indexOf.call(nodes, e.target); // Индекс тега из СТАРОГО меню, по которому был клик

        data_offsettop(div1, div3, 'clean'); // Там создается НОВОЕ меню, изменяется содержимое div3 и, в результате, будет изменена коллекция nodes

        hide_show_scrolling(div, div1, nodes[index], div_w, index, e);
    };


    var delta_butt_div2 = butt.offsetLeft - div2.offsetLeft;
    if (delta_butt_div2 > 0) {
        div2.style.width = parseInt(div2.style.width) - delta_butt_div2 + 'px'; // Корректируем ширину распорки, чтобы она не выступала слева от кнопки
    }

    hide_show_scrolling(div, div1, div3, div_w, -1, null); // При загрузке/обновлении страницы сворачиваем окно

// *************      ФУНКЦИИ     *********************************

// Функция задает значения отступов от верхней части экрана для тегов, содержащих fontWeight > 400 и создает меню из содержимого этих тегов
    function data_offsettop(div1, div3, to_do) {

        var scrolltop = div1.scrollTop; // Запоминаем величину прокрутки контейнера с пунктами СТАРОГО меню

        if (to_do === 'clean') { // Уничтожаем пункты старого меню
            div3.innerHTML = '';
        }

        var tags = main_cont.querySelectorAll('*');

        for (var i = 0; i < tags.length; i++) { // Задаем значения отступов от верхней части экрана для тегов, содержащих fontWeight > 400
            var tag = tags[i];
            var text = check_item(tag, attr, val);

            if (text) { // Если тег удовлетворяет условиям (т.е. нужно ли его текст включать в оглавление)

                var p = document.createElement('p');
                    p.style.color = '#B37C0C';
                    p.textContent = text;
                    p.title = 'Перейти';
                    p.style.cursor = 'pointer';

                var offsettop = parseInt(offsetPosition(tag)[1]);
                    p.setAttribute('data-offsettop', offsettop);

                div3.appendChild(p);
            }
        }

        div1.scrollTop = scrolltop; // Возвращаем ранее сохраненное значение прокрутки в НОВОЕ меню

    }
// Функция проверяет, удовлетворяет ли тег условиям заголовка (т.е. нужно ли включать его текст в оглавление)
    function check_item(tag, attr, val) {
    // 1. Проверяем 1-е условие (жирность)
        var flag = getComputedStyle(tag, null).fontWeight > 400;

        if(!flag) {
            return false;
        }

        var tag_texcontent = tag.textContent.replace(/^\s+/, '').replace(/\s+$/, '');
            val = escapeRegExp(escapeRegExp(val)); // Дважды экранируем, т.к. RegExp

        var reg = new RegExp("^" + val + "[\\d\\.]+.+");
        var text = (tag_texcontent.match(reg) || []) [0];

    // 2. Проверяем 2-е условие (совпадение первого символа пункта оглавления с заданным)
        if(!text) {
            return false;
        }

        return text;
    }

// Функция декодирует HTML-entities - превращает сущности в символы, например: &amp;  ->  &
    function decodeHTMLEntities(text) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

// Функция экранирует специальные символы в строках регулярных выражений
    function escapeRegExp(str) { // - ^ $ \ . * + ? ( ) [ ] { } |
        return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
    }

// Функция показывает/скрывает панель оглавления
    function hide_show_scrolling(div, div1, node, div_w, index, e) {

        var target = e ? e.target : null;

        if (index > 0 && node && target) {
            target = node; // Выбираем тег - пункт нового меню - с тем же самым номером, по которому был клик в старом меню
        }


        var butt = div.firstElementChild;

        if (target == butt || !target) {
            var h = parseInt(getComputedStyle(butt).width);

            if (parseInt(getComputedStyle(div1).height) > h) {
                div1.style.height = h + 'px';
                div.style.width = h + 'px';
                div.style.overflow = 'hidden';
                div1.style.display = 'none';
                butt.innerHTML = '&#9660;';
                butt.title = 'Развернуть оглавление';
            } else {
                div1.style.height = '';
                div.style.width = div_w;
                div.style.overflow = '';
                div1.style.display = 'block';
                butt.innerHTML = '-';
                butt.title = 'Свернуть';
            }
        } else if (target.tagName.toLowerCase() === 'p') {
            if (target.hasAttribute('data-offsettop')) {
                var offsettop = target.getAttribute('data-offsettop');

                scrollTopPAGE(100, offsettop);
            }
        }
    }


//Функция медленно прокручивает документ к указанному расстоянию до верха документа
    function scrollTopPAGE(speed, topDistance) {
// speed - время прокрутки (в миллисекундах)
// topDistance - требуемое расстояние (topOffset) от верха страницы, до которого должна выполниться прокрутка (в пикселях)

        topDistance = Math.abs(parseInt(topDistance));

        var stepTime = 20;
        var docBody = document.body;
        var docElem = document.documentElement;

        var scrollAnimationStep = function (initPos, stepAmount) {
            var newPos = (initPos + stepAmount) * stepAmount < topDistance * stepAmount ? initPos + stepAmount : topDistance;

            docBody.scrollTop = docElem.scrollTop = newPos;


            if (newPos * stepAmount < topDistance * stepAmount) {
                setTimeout(function () {
                    scrollAnimationStep(newPos, stepAmount);
                    console.log('timer in scrollTopPAGE()...' + arguments.callee.toString());
                }, stepTime);
            }
        };

        var scrollTopAnimated = function (speed) {
            var topOffset = docBody.scrollTop || docElem.scrollTop;
            var stepAmount = topOffset;


            speed && (stepAmount = ((-topOffset + topDistance) * stepTime) / speed);

            scrollAnimationStep(topOffset, stepAmount);
        };

        scrollTopAnimated(speed);
    }

    function offsetPosition(element) {
        var offsetLeft = 0, offsetTop = 0;
        do {
            offsetLeft += element.offsetLeft;
            offsetTop += element.offsetTop;
        } while (element = element.offsetParent);
        return [offsetLeft, offsetTop];
    }
})();

/*]] --> */
</script>
