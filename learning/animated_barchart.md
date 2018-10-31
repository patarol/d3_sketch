## Animated `barchart`

Let's walk through the two mouse event handlers we added to our code:

``` javascript
g.selectAll(".bar")
.data(data)
.enter().append("rect")
.attr("class", "bar")
.on("mouseover", onMouseOver)
.on("mouseout", onMouseOut)
.attr("x", function(d) { return x(d.year); })
.attr("y", function(d) { return y(d.value); })
.attr("width", x.bandwidth())
.transition()
.ease(d3.easeLinear)
.duration(400)
.delay(function (d, i) {
    return i * 50;
})
.attr("height", function(d) { return height - y(d.value); });

```

On selection of bar elements, we have added two new event handlers, viz. `mouseover` and `mouseout` and we are calling the respective functions to handle mouse events.This is done to apply animation when mouse hovers over a particular bar and goes out of it.

``` javascript

function onMouseOver(d, i) {

    d3.select(this).attr('class', 'highlight');
    d3.select(this)
      .transition()
      .duration(400)
      .attr('width', x.bandwidth() + 5)
      .attr("y", function(d) { return y(d.value) - 10; })
      .attr("height", function(d) { return height - y(d.value) + 10; });

    g.append("text")
     .attr('class', 'val') // add class to text label
     .attr('x', function() {
         return x(d.year);
     })
     .attr('y', function() {
         return y(d.value) - 15;
     })
     .text(function() {
         return [ '$' +d.value];  // Value of the text
     });
}
```

In the mouseover event, we want to increase the bar width and height, and the bar color of the selected bar (given by the 'this' object) to `orange`. For the color, we have added a class '`highlight`' which changes the color of the selected bar to orange. Then, we have added a transition function to the bar for the duration of 400 milliseconds. So now, when we increase the width of the bar by 5px, and the height by 10px, the transition from previous width and height of the bar to the new width and height will be for the duration of 400 milliseconds. Note that we have also supplied a new 'y' value to the bar so that the bar does not get distorted due to the new height value.

Along with highlighting the selection by changing its width and height, we also want to display the bar value as a text. For this, we have appended a text element to the group element and specified the x and y positions of the text element. The text is given by `[ '$' +d.value]`.

``` javascript
function onMouseOut(d, i) {
        d3.select(this).attr('class', 'bar');
        d3.select(this)
          .transition()
          .duration(400)
          .attr('width', x.bandwidth())
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });

        d3.selectAll('.val')
          .remove()
    }
```

In the mouseout event, we want to remove the selection features that we had applied in the mouseover event. So, we revert the bar class to the original '`bar`' class and also restore the original width and height of the selected bar. We have also restored the y value to the original `value. d3.selectAll('.val').remove()` removes the text value we had added during the bar selection.
