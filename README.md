# create-table-of-contents

The script searches the webpage's HTML code for a tag with the ID `content_razn` and looks within it for tags that meet two conditions:

1. The tag MUST be bold (font weight greater than 400),
2. The text content of the tag MUST begin with a paragraph symbol (§). The script extracts this text content to generate a table of contents. The table of contents panel is positioned at the top right of the page (a small red button with a black triangular arrow). An example of the script in action can be found here: http://4846d.ru/raznoe/pomoyka-ssha.html

The script is cross-browser compatible and works correctly in Firefox (versions 24, 36), Edge (version 109), Pale Moon. 
Note: clicking on table of contents items triggers a relatively slow scroll to the corresponding paragraph. Furthermore:

1. The IDs of these paragraphs are NOT used (in fact, they may not even be defined).
2. The page URL does NOT change during scrolling (i.e., no hash is added to the end of the URL).

Скрипт создает ищет в HTML-коде вебстраницы тег с id="content_razn", в нем ищет теги, удовлетворяющие двум условиям:
1. Тег ДОЛЖЕН иметь полужирное выделение (степень жирности выше 400),
2. в начале текстового содержимого тега ДОЛЖЕН присутствовать символ параграфа ( § ).
Скрипт берет их текстовое содержимое (контент) и создает из этого оглавление. Панель с оглавлением располагается наверху справа страницы (небольшая красная кнопка с черным треугольником-стрелкой). Пример работы скрипта - здесь: http://4846d.ru/raznoe/pomoyka-ssha.html

Скрипт является кроссбраузерным, корректно работает в браузерах Firefox 24, 36; Edge 109; Pale Moon.
Важно: при нажатии на пункты оглавления происходит относительно медленное перелистывание страницы к соответствующему параграфу. При этом:
1. НЕ ИСПОЛЬЗУЮТСЯ id этих параграфов (id могут вообще не заданы).
2. URL страницы при перелистывании НЕ МЕНЯЕТСЯ (т.е. хеш в конце URL НЕ ДОБАВЛЯЕТСЯ). 
