(function(){
    d3.select('#collapser').on('click', function(){
        var toggle_selector = d3.select(this).attr('data-toggle');
        var toggle = d3.selectAll(toggle_selector);
        toggleClass(toggle, '_collapsed');
        toggleClass(toggle, '_collapse');
    });
    
    function toggleClass(el, clazz) { el.classed(clazz, function(){return !d3.select(this).classed(clazz)}) }
})();