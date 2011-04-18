// Created by Wolverinex02 (http://wolverinex02.blogspot.com/) 
// modified:  changed forkosh.com to codecogs.com
//            changed the button to use codecogs
//            cleaned up/formatted code a bit
//            added an unLaTeX button,  FIXME:  make it work
//
//            kept the french naming confention

// FEATURES
// Works only in Compose modes
// transform latex equation between '$$' in LaTeX pics by using http://latex.codecogs.com
// This script works thanks the excellent site: http://latex.codecogs.com

// TODO
// modify the script to undo the transformation

// ==UserScript==
// @name           LaTeX for Blogger
// @namespace      http://wolverinex02.blogspot.com
// @description    You can use LaTeX in Blogger.
// @include        http://*.blogger.com/post-edit.g?*
// @include        http://*.blogger.com/post-create.g?*
// ==/UserScript==

window.addEventListener("load", function(e) {
    function setlatex(domname) 
    {
        var editbar = document.getElementById(domname);
        if (editbar) {
            var buttons = LaTeXButton("Latex", "http://latex.codecogs.com/gif.latex?\\LaTeX");
            buttons += unLaTeXButton("unLaTeX", "http://latex.codecogs.com/gif.latex?{\\rm un}\\LaTeX");
            buttons += separator();
            editbar.innerHTML += buttons;
        }
    }

    function LaTeXButton(name, url)
    {
        return "<span class='' style='display: block;' id='htmlbar_undefined' title='" + name +
               "' onmouseover='ButtonHoverOn(this);' onmouseout='ButtonHoverOff(this);' onmouseup='' onmousedown='CheckFormatting(event);(" +
               "function latex_compilator()" +
               "{" +
                   "var rich_edit = document.getElementById(\"richeditorframe\");" +
                   "var rich_body = rich_edit.contentDocument.getElementsByTagName(\"body\");" +
                   "var contenu = rich_body[0].innerHTML;" +
                   "while(contenu.indexOf(\"$$\")!=-1)" +
                   "{" +
                        "var debut = contenu.indexOf(\"$$\");" +
                        "contenu = contenu.substring(0,debut) + contenu.substring(debut+2,contenu.length); var fin = contenu.indexOf(\"$$\");" +
                        "contenu = contenu.substring(0,fin) + contenu.substring(fin+2,contenu.length);" +
                        "var latex_eq = contenu.substring(debut,fin);" +
                        "rich_body[0].innerHTML = contenu.substring(0,debut);" +
                        "rich_body[0].innerHTML+=\"<img src=\\\"http://latex.codecogs.com/gif.latex?\"+latex_eq+\"\\\" alt=\\\"\"+latex_eq+\"\\\" align=\\\"middle\\\" border=\\\"0\\\" />\";" +
                        "rich_body[0].innerHTML+= contenu.substring(fin,contenu.length);" +
                        "contenu = rich_body[0].innerHTML;" +
                   "}" +
               "}" +
               ")();ButtonMouseDown(this);'><img src='" + url + "' alt='" + name + "' border='0'></span>\n";
    }

    function unLaTeXButton(name, url)
    {
        return "<span class='' style='display: block;' id='htmlbar_undefined' title='" + name +
               "' onmouseover='ButtonHoverOn(this);' onmouseout='ButtonHoverOff(this);' onmouseup='' onmousedown='CheckFormatting(event);(" +
               "function latex_compilator()" +
               "{" +
                   "var rich_edit = document.getElementById(\"richeditorframe\");" +
                   "var rich_body = rich_edit.contentDocument.getElementsByTagName(\"body\");" +
                   "var contenu = rich_body[0].innerHTML;" +
                   "while(contenu.indexOf(\"<img src=\\\"http://latex.codecogs.com/gif.latex?\")!=-1)" +
                   "{" +
                        "var idx = contenu.indexOf(\"<img src=\\\"http://latex.codecogs.com/gif.latex?\");" +
                        "var initial = contenu.substring(0,idx);" +
                        "var next = contenu.substring(idx+46,contenu.length);" +
                        "idx = next.indexOf(\" alt=\\\"\");" +
                        "next = next.substring(idx+6, next.length);" +
                        "idx = next.indexOf(\"\\\"\");" +
                        "var latex_eq = next.substring(0,idx);" +
                        "idx = next.indexOf(\"align=\\\"middle\\\" border=\\\"0\\\">\");" +
                        "var final = next.substring(idx+26, next.length);" +
                        "contenu = initial + \"$$\" + latex_eq + \"$$\" + final;" +
                        "rich_body[0].innerHTML = contenu;" +
                   "}" +
               "}" +
               ")();ButtonMouseDown(this);'><img src='" + url + "' alt='" + name + "' border='0'></span>\n";
    }

    function separator() {
        return "<div style=\"display: block;\" class=\"vertbar\"><span style=\"display: block;\" class=\"g\">&nbsp;</span><span style=\"display: block;\" class=\"w\">&nbsp;</span></div>\n";
    }

    setlatex("formatbar");
}, false);
