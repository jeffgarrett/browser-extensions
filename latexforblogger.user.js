// Created by Wolverinex02 (http://wolverinex02.blogspot.com/) 
// Heavily modified by jgarrett (http://blog.jgarrett.org/)

// ==UserScript==
// @name           LaTeX for Blogger
// @namespace      http://wolverinex02.blogspot.com
// @description    You can use LaTeX in Blogger.
// @include        http://*.blogger.com/post-edit.g?*
// @include        http://*.blogger.com/post-create.g?*
// ==/UserScript==

function latexify()
{
    function create_img(eq)
    {
        var img = document.createElement('img');
        img.setAttribute('src', 'http://latex.codecogs.com/gif.latex?'+eq);
        img.setAttribute('alt', eq);
        img.setAttribute('align', 'middle');
        img.setAttribute('border', 0);

        return img;
    }

    var rich_edit = document.getElementById('postingComposeBox');
    // old editor?
    if (!rich_edit)
        rich_edit = document.getElementById("richeditorframe");

    var rich_body = rich_edit.contentDocument.getElementsByTagName("body")[0];
    var contenu = rich_body.innerHTML;

    while (contenu.indexOf("$$") != -1)
    {
        var debut = contenu.indexOf("$$");
        contenu = contenu.substring(0,debut) + contenu.substring(debut+2,contenu.length); var fin = contenu.indexOf("$$");
        contenu = contenu.substring(0,fin) + contenu.substring(fin+2,contenu.length);
        var latex_eq = contenu.substring(debut,fin);
        rich_body.innerHTML = contenu.substring(0,debut);
        rich_body.appendChild(create_img(latex_eq));
        rich_body.innerHTML+= contenu.substring(fin,contenu.length);
        contenu = rich_body.innerHTML;
    }
}

function delatexify()
{
    var rich_edit = document.getElementById('postingComposeBox');
    // old editor?
    if (!rich_edit)
        rich_edit = document.getElementById("richeditorframe");
    var rich_body = rich_edit.contentDocument.getElementsByTagName("body")[0];

    var imgs = rich_body.getElementsByTagName("img");

    for (var i = 0; i < imgs.length; i++)
    {
        if (imgs[i].src.indexOf("http://latex.codecogs.com/gif.latex?") == 0)
        {
            // Replace the image with its alt text
            var fragment= document.createDocumentFragment();
            var txt = document.createTextNode("$$" + imgs[i].alt + "$$");
            fragment.appendChild(txt);

            imgs[i].parentNode.replaceChild(fragment, imgs[i]);
            i--;
        }
    }
}

function defineFunction(n, f)
{
    var script = document.createElement("script");
    script.textContent = "var " + n + " = (" + f.toString() + ");";
    document.body.appendChild(script);
}

function LaTeXButton(name, url, cbname)
{
    var span = document.createElement('span');
    span.setAttribute('class', '');
    span.setAttribute('style', 'display: block;');
    span.setAttribute('id', 'htmlbar_undefined');
    span.setAttribute('title', name);
    span.setAttribute('onmouseover', 'ButtonHoverOn(this);');
    span.setAttribute('onmouseout', 'ButtonHoverOff(this);');
    span.setAttribute('onmouseup', '');
    span.setAttribute('onmousedown', 'CheckFormatting(event);'+cbname+'();ButtonMouseDown(this);');

    var img = document.createElement('img');
    img.setAttribute('src', url);
    img.setAttribute('alt', name);
    img.setAttribute('border', 0);
    span.appendChild(img);

    return span;
}

function separator()
{
    var div = document.createElement('div');
    div.setAttribute('style', 'display: block;');
    div.setAttribute('class', 'vertbar');

    var span1 = document.createElement('span');
    span1.setAttribute('style', 'display: block;');
    span1.setAttribute('class', 'g');
    span1.innerHTML = '&nbsp;';

    var span2 = document.createElement('span');
    span2.setAttribute('style', 'display: block;');
    span2.setAttribute('class', 'w');
    span2.innerHTML = '&nbsp;';

    div.appendChild(span1);
    div.appendChild(span2);

    return div;
}

function newSeparator()
{
    var div = document.createElement('div');
    div.setAttribute('id', ':p');
    div.setAttribute('style', '-webkit-user-select: none;');
    div.setAttribute('class', 'goog-toolbar-separator goog-inline-block');
    div.setAttribute('role', 'separator');

    div.innerHTML = '.';

    return div;
}

function newLaTeXButton(name, url, cbname)
{
    var div = document.createElement('div');
    div.setAttribute('class', 'goog-inline-block goog-toolbar-button goog-toolbar-button-hover');
    div.setAttribute('title', name); 
    div.setAttribute('role', 'button');
    div.setAttribute('style', '-webkit-user-select: none;');
    div.setAttribute('id', name);
    div.setAttribute('aria-pressed', 'false');

    var outerdiv = document.createElement('div');
    div.setAttribute('class', 'goog-inline-block goog-toolbar-button-outer-box');
    div.setAttribute('style', '-webkit-user-select: none;');

    var innerdiv = document.createElement('div');
    div.setAttribute('class', 'goog-inline-block goog-toolbar-button-inner-box');
    div.setAttribute('style', '-webkit-user-select: none;');

    var img = document.createElement('img');
    img.setAttribute('style', '-webkit-user-select: none;');
    img.setAttribute('src', url);
    img.setAttribute('alt', name);
    img.setAttribute('border', 0);
    img.setAttribute('onmousedown', cbname+'();', false);

    innerdiv.appendChild(img);
    outerdiv.appendChild(innerdiv);
    div.appendChild(outerdiv);

    return div;
}

function addLaTeXButtons(e)
{
    // old editor
    var editbar = document.getElementById("formatbar");
    if (editbar) {
        editbar.appendChild(LaTeXButton("LaTeX", "http://latex.codecogs.com/gif.latex?\\LaTeX", 'latexify'));
        editbar.appendChild(LaTeXButton("unLaTeX", "http://latex.codecogs.com/gif.latex?{\\rm un}\\LaTeX", 'delatexify'));
        editbar.appendChild(separator());
    }

    // new editor
    var editbar = document.getElementById("postingComposeToolbar");
    if (editbar) {
        var holder = document.getElementsByClassName('editorHolder')[0];
        holder.setAttribute('style', 'width: 710px;');

	editbar = editbar.firstChild;
        editbar.appendChild(newSeparator());
        editbar.appendChild(newLaTeXButton("LaTeX", "http://latex.codecogs.com/gif.latex?x^2", 'latexify'));
        editbar.appendChild(newLaTeXButton("unLaTeX", "http://latex.codecogs.com/gif.latex?\\not\\!{x^2}", 'delatexify'));
    }


    // export the callbacks
    defineFunction("latexify", latexify);
    defineFunction("delatexify", delatexify);
}

window.addEventListener("load", addLaTeXButtons, false);
