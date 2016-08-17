var collapser = (function () {
    var module = {};

    var element = d3.select('#collapser');

    function toggleClass(el, clazz) {
        el.classed(clazz, function () {
            return !d3.select(this).classed(clazz)
        })
    }

    module.toggle = function() {
        var toggle_selector = element.attr('data-toggle');
        var toggle = d3.selectAll(toggle_selector);
        toggleClass(toggle, '_collapsed');
        toggleClass(toggle, '_collapse');
    };

    element.on('click', module.toggle);

    return module;
})();