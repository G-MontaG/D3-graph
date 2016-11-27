export class ContextMenu {
    private d3;

    constructor(d3) {
        this.d3 = d3;
    }

    public contextMenu(menu, openCallback) {

        // create the div element that will hold the context menu
        this.d3.selectAll('.d3-context-menu').data([1])
            .enter()
            .append('div')
            .attr('class', 'd3-context-menu');

        // close menu
        this.d3.select('body').on('click.d3-context-menu', () => {
            this.d3.select('.d3-context-menu').style('display', 'none');
        });

        // this gets executed when a contextmenu event occurs
        return (data, index) => {
            let elm = this;

            this.d3.selectAll('.d3-context-menu').html('');
            let list = this.d3.selectAll('.d3-context-menu').append('ul');
            list.selectAll('li').data(menu).enter()
                .append('li')
                .html((d) => {
                    return d.title;
                })
                .on('click', (d, i) => {
                    d.action(elm, data, index);
                    this.d3.select('.d3-context-menu').style('display', 'none');
                });

            // the openCallback allows an action to fire before the menu is displayed
            // an example usage would be closing a tooltip
            if (openCallback) openCallback(data, index);

            // display context menu
            this.d3.select('.d3-context-menu')
                .style('left', (this.d3.event.pageX - 2) + 'px')
                .style('top', (this.d3.event.pageY - 2) + 'px')
                .style('display', 'block');

            this.d3.event.preventDefault();
        };
    }
}