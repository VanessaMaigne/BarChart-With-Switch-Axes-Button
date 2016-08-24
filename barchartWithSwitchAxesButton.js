/*!
 * barchartWithBoxPlotAndSwitchAxes _ version 1.0
 * ##################################################
 *   Created by vmaigne@gmail.com _ August 2016
 * ##################################################
 * This library create a barchart with box plot.
 * You can choose which variables you want to display, by adding or remove one by one.
 * You can display or hide uncertaint (box plot).
 *
 * @param containerId : id of the barchart container
 * @param width & height : width & height of the barchart, we substract some margin to display axes labels by using the variable "barchartMargin"
 * @param data : data of the barchart
 * Data structure sample :
 *  data = [
 *           {
 *               Name : "Africa",
 *               Data0 : {value : 68, uncertainty : 54},
 *               Data1 : {value : 11, uncertainty : 3},
 *               Data2 : {value : 107, uncertainty : 5},
 *               Data3 : {value : 83, uncertainty : 24},
 *           },
 *           {
 *               Name : "Africa",
 *               Data0 : {value : 81, uncertainty : 7},
 *               Data1 : {value : 15, uncertainty : 2},
 *               Data2 : {value : 179, uncertainty : 78},
 *               Data3 : {value : 64, uncertainty : 9},
 *           },
 *           ...
 *       ]
 */

barchartWithBoxPlot = function(containerId, width, height, data)
{
    var _chart = new Object();
    var _keyOrdinalAxis = "Name";
    var _variables = $.map(data[0], function(element, index) {
        if(_keyOrdinalAxis != index )
            return {name:index, color:false};
    });
    var _displayedVariables = _variables;
    var _ordinalAxisData = $.map(data, function(element, index) {
        if(_keyOrdinalAxis )
            return element[_keyOrdinalAxis];
    });
    var _useRightYAxis = false;
    var _displayUncertainty = true;

    var barchartMargin = {top: 10, right: 0, bottom: 75, left: 60};
    var colorArray=["#555555", "#009900", "#723E64", "#ff8c00", "#ff0000", "#a52a2a", "#cb6868", "#FFDF00", "#efe28a", "#66cdaa", "#77B5FE", "#4682b4", "#006400", "#32cd32"];
    var color = d3.scale.ordinal().domain( _displayedVariables ).range(colorArray);
    var barchartObject = new Object();

    var axisObject = {
        valueAxis : "y",
        valueAxisName : "yAxis",
        ordinalAxis: "x",
        ordinalAxis0 : "x0",
        ordinalAxis1 : "x1"
        //        valueAxis : "x",
        //        valueAxisName : "xAxis",
        //        ordinalAxis: "y",
        //        ordinalAxis0 : "y0",
        //        ordinalAxis1 : "y1"
    };
    var isValueOnYAxis = ("y" == axisObject.valueAxis);


    /*********************************/
    /******** Getters/Setters ********/
    /*********************************/

    _chart.setUseRightYAxis = function( useRightYAxis )
    {
        _useRightYAxis = useRightYAxis;
    };

    _chart.setOrdinalAxisData = function( data )
    {
        _ordinalAxisData = data;
    };

    _chart.setKeyOrdinalAxis = function(keyXAxeValue)
    {
        _keyOrdinalAxis = keyXAxeValue;
    };

    _chart.getDisplayedVariables= function()
    {
        return _displayedVariables;
    };

    _chart.setDisplayedVariables= function(displayedVariables)
    {
        _displayedVariables = displayedVariables;
    };



    /**********************************/
    /******** Public functions ********/
    /**********************************/
    /**
     * This method create the svg container for the barchart
     */
    _chart.create = function()
    {
        // Values on y axis by default
        var regionBarchartValueAxis = d3.scale.linear().range( [height, 0] ); // y by default
        var regionBarchartOrdinalAxis0 = d3.scale.ordinal().rangeRoundBands( [0, width], 0.1 ).domain( _ordinalAxisData ); // x0 by default
        var regionBarchartOrdinalAxis1 = d3.scale.ordinal(); // x1 by default

        // Axes
        var regionBarchartxAxis = d3.svg.axis().scale( regionBarchartOrdinalAxis0 );
        var regionBarchartyAxis = d3.svg.axis()
                .scale( regionBarchartValueAxis )
                .orient( _useRightYAxis ? "right" : "left" )
                .tickSize( -width, 0 );

        // Values on x axis
        if(!isValueOnYAxis){
            regionBarchartValueAxis = d3.scale.linear().range( [0, width] );
            regionBarchartOrdinalAxis0 = d3.scale.ordinal().rangeRoundBands( [0, height], 0.1 ).domain( _ordinalAxisData );

            // Axes
            regionBarchartxAxis = d3.svg.axis().scale( regionBarchartValueAxis );
            regionBarchartyAxis = d3.svg.axis()
                    .scale( regionBarchartOrdinalAxis0 )
                    .orient( _useRightYAxis ? "right" : "left" )
                    .tickSize( -width, 0 );
        }


        $( containerId ).addClass( "barchartWitBoxPlot" );
        // Barchart
        var regionBarchartsvg = d3.select( containerId ).append( "svg" )
                .attr( "width", width + barchartMargin.left + barchartMargin.right )
                .attr( "height", height + barchartMargin.top + barchartMargin.bottom )
                .append( "g" )
                .attr( "transform", "translate(" + (_useRightYAxis ? 0 : barchartMargin.left) + "," + barchartMargin.top + ")" );

        var regionBarchartsvgG = regionBarchartsvg.append( "g" )
                .attr( "class", "y axis" );
        if( _useRightYAxis )
            regionBarchartsvgG.attr( "transform", "translate(" + width + ",0)" );

        regionBarchartsvg.append( "g" )
                .attr( "class", "x axis" )
                .attr( "transform", "translate(0," + height + ")" );

        // xAxis
        regionBarchartsvg.select( '.x.axis' ).call( regionBarchartxAxis );
        regionBarchartsvg.select( '.y.axis' ).call( regionBarchartyAxis );

        barchartObject.width = width;
        barchartObject.valueAxis = regionBarchartValueAxis;
        barchartObject.ordinalAxis0 = regionBarchartOrdinalAxis0;
        barchartObject.ordinalAxis1 = regionBarchartOrdinalAxis1;

        //        barchartObject.x = regionBarchartx;
        //        barchartObject.x0 = regionBarchartx0;
        //        barchartObject.x1 = regionBarchartx1;
        //        barchartObject.y = regionBarcharty0;
        //        barchartObject.y0 = regionBarcharty0;
        //        barchartObject.y1 = regionBarcharty1;
        barchartObject.xAxis = regionBarchartxAxis;
        barchartObject.yAxis = regionBarchartyAxis;
        barchartObject.svg = regionBarchartsvg;
        barchartObject.useRightYAxis = _useRightYAxis;

        updateBarchartAxes();
        _chart.update();
    };

    /**
     *  This method update data with new data to display (after a remove or an add) and update the svg element
     */
    _chart.update = function()
    {
        setColumnDetailsAndTotals();
        updateBarchart();
    };

    _chart.remove = function()
    {
        $( containerId ).empty();
    };

    _chart.changeDisplayUncertainty = function()
    {
        _displayUncertainty = !_displayUncertainty;
    };

    _chart.switchAxes = function()
    {
        if(isValueOnYAxis)
            axisObject = {
                valueAxis : "x",
                valueAxisName : "xAxis",
                ordinalAxis: "y",
                ordinalAxis0 : "y0",
                ordinalAxis1 : "y1"
            };
        else
            axisObject = {
                valueAxis : "y",
                valueAxisName : "yAxis",
                ordinalAxis: "x",
                ordinalAxis0 : "x0",
                ordinalAxis1 : "x1"
            };

        isValueOnYAxis = ("y" == axisObject.valueAxis);

        _chart.remove();
        _chart.create();

        //        updateBarchart();
    };

    /**
     *  This method detects if the variable is already displayed in the barchart then remove or add it in the chart
     */
    _chart.addOrRemoveToBarchart = function( variableName )
    {
        _displayedVariables = _displayedVariables ? _displayedVariables : [];
        var isAlreadyInChart = (0 <= getIndexInArray( _displayedVariables, "name", variableName ));
        if( isAlreadyInChart )
            removeToBarchart( variableName );
        else
            addToBarchart( variableName );
    };



    /*********************************/
    /******* Private functions *******/
    /*********************************/
    /**
     * This method creates details for each column
     */
    function setColumnDetailsAndTotals()
    {
        data.forEach( function( d )
        {
            var index = 0;
            d.columnDetails = _displayedVariables.map( function( element, i )
            {
                var result = {name: element.name, column: index.toString(), yBegin: (0 > d[element.name].value ? d[element.name].value : 0), yEnd: (0 < d[element.name].value ? d[element.name].value : 0), uncertainty: d[element.name].uncertainty, color:false, region:d.Name};
                index++;
                return result;
            } );

            d.columnDetails = d.columnDetails.filter( function( n )
            {
                return n != undefined
            } );

            d.negativeTotal = d3.min( d.columnDetails,function( d )
            {
                if( _displayUncertainty && d.uncertainty && !isNaN( parseFloat( d.uncertainty ) ) )
                    return d ? parseFloat( d.yBegin ) + parseFloat( d.uncertainty ) : 0;
                else
                    return d ? parseFloat( d.yBegin ) : 0;
            } );

            d.positiveTotal = d3.max( d.columnDetails, function( d )
            {
                if( _displayUncertainty && d.uncertainty && !isNaN( parseFloat( d.uncertainty ) ) )
                    return d ? parseFloat( d.yEnd ) + parseFloat( d.uncertainty ) : 0;
                else
                    return d ? parseFloat( d.yEnd ) : 0;
            } );
        } );
    }

    /**
     *  This method update all svg, DOM and content elements of the barchart (domain, axes, legend, ...)
     */
    function updateBarchart()
    {
        updateBarchartDomains();
        updateBarchartAxes();
        updateBarchartBar();
        updateBarchartUncertainty();
        updateBarchartLegend();
    }

    /**
     *  This method update the domains for X and Y axes (after remove or add a variable)
     */
    function updateBarchartDomains()
    {
        barchartObject.valueAxis.domain( [d3.min( data, function( d )
        {
            return d.negativeTotal;
        } ), d3.max( data, function( d )
        {
            return d.positiveTotal;
        } )] );

        barchartObject.ordinalAxis1.domain( d3.keys( _displayedVariables ) ).rangeRoundBands( [0, barchartObject.ordinalAxis0.rangeBand()] );
    }

    /**
     *  This method update the X and Y axes (after remove or add a variable)
     */
    function updateBarchartAxes()
    {
        // Update value Axis
        barchartObject.svg
                .select( '.'+axisObject.valueAxis+'.axis' )
                .call( barchartObject[axisObject.valueAxisName] )
                .selectAll( 'line' )
                .filter( function( d )
                {
                    return !d
                } )
                .classed( 'zero', true );

        // Rotate the ordinal axis labels
        barchartObject.svg.selectAll( "g." + axisObject.ordinalAxis + " g text" )
                .style( "text-anchor", "end" )
                .attr( "transform", "translate(-10,0)rotate(315)" )
                .text( function( d, i )
                {
                    return d;
                } );
    }

    /**
     *  This method update the legends (after remove or add a variable)
     */
    function updateBarchartLegend()
    {
        var legend = barchartObject.svg.selectAll( ".legend" )
                .data(_displayedVariables);

        var legendsEnter = legend.enter().append( "g" )
                .attr( "class", "legend" );

        legendsEnter.append( "rect" )
                .attr( "id", function( d, i )
                {
                    return "regionBarchartSvg_legendRect_" + i;
                } )
                .attr( "x", barchartObject.width - 18 )
                .attr( "width", 10 )
                .attr( "height", 10 );

        legendsEnter.append( "text" )
                .attr( "x", barchartObject.width - 24 )
                .attr( "y", 9 )
                .attr( "dy", 0 )
                .style( "text-anchor", "end" );
        legend.exit().remove();

        // When remove bar
        legend.select( "text" )
                .text( function( d )
                {
                    return d.name;
                });

        legend.select( "rect" )
                .style( "fill", function( d )
                {
                    if( !d.color )
                        d.color = color( d.name );
                    return d.color;
                } )
                .style( "stroke", "#2C3537" )
                .attr( "x", barchartObject.width - 18 )
                .on( "click", function( d )
                {
                    removeToBarchart( d.name);
                } );

        legend.select( "text" ).transition().duration( 1000 ).ease( "linear" )
                .attr( "x", barchartObject.width - 24 );

        legend.attr( "transform",function( d, i )
        {
            return "translate(0," + i * 15 + ")";
        });
    }

    /**
     *  This method update the bars : height and width (after remove or add a variable)
     */
    function updateBarchartBar()
    {
        var regionBar = barchartObject.svg.selectAll( ".groupedBar" )
                .data(data);

        var regionBarEnter = regionBar.enter().append( "g" )
                .attr( "class", "groupedBar" )
                .attr( "transform", function( d )
                {
                    if(isValueOnYAxis)
                        return "translate(" + barchartObject.ordinalAxis0( d[_keyOrdinalAxis] ) + ",0)";
                    else
                        return "translate(0," + barchartObject.ordinalAxis0( d[_keyOrdinalAxis] ) +")";
                });

        var regionBarRect = regionBar.selectAll( "rect" )
                .data( function( d )
                {
                    return d.columnDetails;
                });

        regionBarRect.enter().append( "rect" )
                .on( "click", function( d )
                {
                    removeToBarchart( d.name );
                });

        regionBarRect.exit().remove();

        regionBar.transition()
                .duration( 500 )
                .ease( "linear" )
                .selectAll( "rect" )
                .attr( "width", function( d ){
                    if(isValueOnYAxis)
                        return barchartObject.ordinalAxis1.rangeBand();
                    else
                        return barchartObject.valueAxis( d.yEnd ) - barchartObject.valueAxis( d.yBegin );
                } )
                .attr( "height", function( d )
                {
                    if(isValueOnYAxis)
                        return barchartObject.valueAxis( d.yBegin ) - barchartObject.valueAxis( d.yEnd );
                    else
                        return barchartObject.ordinalAxis1.rangeBand();
                } )
                .attr( axisObject.ordinalAxis, function( d )
                {
                    if(isValueOnYAxis)
                        return barchartObject.ordinalAxis1( d.column );
                    else
                        return barchartObject.ordinalAxis1( d.column );
                })
                .attr( axisObject.valueAxis, function( d )
                {
                    if(isValueOnYAxis)
                        return barchartObject.valueAxis( d.yEnd );
                    else
                        return barchartObject.ordinalAxis1( d.yBegin );
                })
                .style( "fill", function( d )
                {
                    if( !d.color )
                        d.color = color( d.name );
                    return d.color;
                });
    }

    /**
     *  This method display or hide uncertainty on each bars
     */
    function updateBarchartUncertainty()
    {
        var regionBar = barchartObject.svg.selectAll( ".groupedBar" )
                .data( data );

        var regionBarPath = regionBar.selectAll( "path" )
                .data( function( d )
                {
                    return d.columnDetails;
                });

        regionBarPath.enter().append( "path" );
        regionBarPath.exit().remove();

        regionBar.transition()
                .duration( 500 )
                .ease( "linear" )
                .selectAll( "path" )
                .attr( "d", function( d )
                {
                    var xCenter = barchartObject.ordinalAxis1( d.column ) + barchartObject.ordinalAxis1.rangeBand() / 2;
                    var lineWidth = barchartObject.ordinalAxis1.rangeBand() / 5;
                    var yTop = barchartObject.valueAxis( parseFloat( d.yEnd ) + parseFloat( d.uncertainty ) );
                    var yBottom = barchartObject.valueAxis( parseFloat( d.yEnd ) - parseFloat( d.uncertainty ) );
                    if( 0 > d.yBegin )
                    {
                        yTop = barchartObject.valueAxis( parseFloat( d.yBegin ) + parseFloat( d.uncertainty ) );
                        yBottom = barchartObject.valueAxis( parseFloat( d.yBegin ) - parseFloat( d.uncertainty ) );
                    }

                    if( _displayUncertainty && d.uncertainty )
                        if(isValueOnYAxis)
                            return "M" + (xCenter - lineWidth) + "," + yBottom + "L" + (xCenter + lineWidth) + "," + yBottom + "M" + xCenter + "," + yBottom +
                                    "L" + xCenter + "," + yTop + "M" + (xCenter - lineWidth) + "," + yTop + "L" + (xCenter + lineWidth) + "," + yTop;
                        else
                            return "M" + yBottom+ "," + (xCenter + lineWidth) + "L" + yBottom + "," + (xCenter - lineWidth)  + "M" + yBottom + "," + xCenter +
                                    "L" + yTop + "," + xCenter + "M" + yTop + "," + (xCenter + lineWidth) + "L" + yTop + "," + (xCenter - lineWidth);
                    else
                        return "";
                })
                .attr( "stroke", function( d )
                {
                    if( !d.color )
                        d.color = color( d.name );
                    return ColorLuminance( d.color, -0.3 );
                } )
                .attr( "stroke-width", 2);
    }

    /**
     *  This method remove a variable from the displayedVariable array and update the chart
     */
    function removeToBarchart( variableName )
    {
        var index = getIndexInArray( _displayedVariables, "name", variableName );
        if( 0 > index )
            return;
        _displayedVariables.splice( index, 1 );
        _chart.update();
    }

    /**
     *  This method add a variable in the displayedVariable array and update the chart
     */
    function addToBarchart( variableName )
    {
        _displayedVariables.push( {name : variableName, color: false} );
        _chart.update();
    }

    return _chart;
};


/**
 * http://www.sitepoint.com/javascript-generate-lighter-darker-color/
 * Warning : colors must be in hexadecimal, color's names are not working !
 */
function ColorLuminance( hex, lum )
{

    // validate hex string
    hex = String( hex ).replace( /[^0-9a-f]/gi, '' );
    if( hex.length < 6 )
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for( i = 0; i < 3; i++ )
    {
        c = parseInt( hex.substr( i * 2, 2 ), 16 );
        c = Math.round( Math.min( Math.max( 0, c + (c * lum) ), 255 ) ).toString( 16 );
        rgb += ("00" + c).substr( c.length );
    }

    return rgb;
}

/**
 * This method find the value "valueToFind" in the object's array "array" with the parameter "parameter" and returns its index.
 * @param array
 * @param parameter
 * @param valueToFind
 */
function getIndexInArray( array, parameter, valueToFind )
{
    var result = -1;
    $.each( array, function( i, d )
    {
        if( d[parameter] == valueToFind )
        {
            result = i;
            return false;
        }
    } );
    return result;
}
