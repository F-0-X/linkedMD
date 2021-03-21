// function updateToolBar(){
//     toolbarBuiltInButtons["scrollsync"] = {
//         name = "scrollsync",
//         className = "fa fa-sort-circle",
//         title: "scrollsync",
//         default: true
//     }
// }

function SimpleMDE_SUB(option){
    SimpleMDE.call(this, option);
}
SimpleMDE_SUB.prototype = Object.create(SimpleMDE.prototype);
SimpleMDE_SUB.prototype.constructor = SimpleMDE_SUB;
SimpleMDE_SUB.prototype.markdown = mymarkdown;
// SimpleMDE_SUB.prototype.createSideBySide = mysidebyside;



function mysidebyside(){
    var cm = this.codemirror;
	var wrapper = cm.getWrapperElement();
	var preview = wrapper.nextSibling;

	if(!preview || !/editor-preview-side/.test(preview.className)) {
		preview = document.createElement("div");
		preview.className = "editor-preview-side";
		wrapper.parentNode.insertBefore(preview, wrapper.nextSibling);
	}

}



function mymarkdown (text) {

    var hljs = require('highlight.js'); // https://highlightjs.org/

    // Actual default values
    var md = require('markdown-it')({
        highlight: function(str, lang) {
            var esc = md.utils.escapeHtml;

            try {
                if (lang && lang !== "auto" && hljs.getLanguage(lang)) {
                    return '<pre class="hljs language-' + esc(lang.toLowerCase()) + '"><code>' + hljs.highlight(lang, str, true).value + "</code></pre>";
                } else if (lang === "auto") {
                    var result = hljs.highlightAuto(str);
                    /*eslint-disable no-console*/        
                    console.log("highlight language: " + result.language + ", relevance: " + result.relevance);
                    return '<pre class="hljs language-' + esc(result.language) + '"><code>' + result.value + "</code></pre>";
                }
            } catch (__) {}
                return '<pre class="hljs"><code>' + esc(str) + "</code></pre>";
        },
        html: true,
    });
    //var md = require('markdown-it')();
    var mk = require('markdown-it-katex');

    md.use(mk);

    console.log(md.render(text));

    let before = '<div class="markdown-body">';
    let after = '</div>';

    return before + md.render(text) + after;
}

function dropHandler(event){
    console.log("File(s) dropped");
    event.preventDefault();
    console.log("1");
    if(event.dataTransfer.items){
        console.log("2");
        if(event.dataTransfer.items[0].kind === 'file'){
            console.log("3");
            var file = event.dataTransfer.items[0].getAsFile();
            var re = new RegExp(".md$");
            if(file.name.match(re)){
                console.log("4");
                var reader = new FileReader();
                reader.onload = e => {
                    // console.log(e.target.result);
                    editor.value(e.target.result);
                };
                reader.readAsText(file);
            }
        }
    }
}

function updateTitle(){
    var isClean = editor.codemirror.getDoc().isClean();
    if(!isClean){
        document.title = filename +  bulletpoint + " - " + appname;
    }else{
        document.title = filename + " - " + appname;
    }
}