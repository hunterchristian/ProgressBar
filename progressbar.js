(function ( root, factory ) {

    if( typeof define === 'function' && define.amd ) {
        // AMD
        define( ['jquery',
                'underscore',
                'components/basic-class',
                'css!cssfiles/loading-modal'],
                factory );
    } else {
        // Browser globals
        root.ProgressBar = factory( root.$, root._, root.BasicClass );
    }

}( this, function ( $, _, BasicClass ) {

    var error = function( msg ) { throw new Error(msg); };

    // Return a constructor for the ProgressBar object
    var ProgressBar = function () {

        // Make sure that the 'new' keyword is not left out when instantiating a new object. If the 'new' keyword is left
        // out, the 'this' keyword will be set to the global context rather than the ProgressBar context, so we check the
        // value of 'this' to ensure that 'new' was used.
        if( !(this instanceof ProgressBar) ) {
            error( 'cannot instantiate ProgressBar without using the "new" keyword' );
        }

        // Need at least one argument
        if (arguments[0] === undefined) {
            error( 'constructor requires at least one argument' );
        }

        var defaultParams = {
            title:              'Loading...',
            current:            0,
            total:              1,
            closeOnComplete:    false,
            timeToShowComplete: 100,
            onComplete:         undefined
        };

        _.extend(this, defaultParams);

        switch (typeof arguments[0]) {

            case 'string':
                this.title = arguments[0];

                break;

            case 'object':
                // If an empty string is passed in for title, we don't want to overwrite it with defaultParams
                this.title              = arguments[0].title === "" ? "" : arguments[0].title || defaultParams.title;
                this.total              = arguments[0].total              || defaultParams.total;
                this.current            = arguments[0].current            || defaultParams.current;
                this.closeOnComplete    = arguments[0].closeOnComplete    || defaultParams.closeOnComplete
                this.timeToShowComplete = arguments[0].timeToShowComplete || defaultParams.timeToShowComplete
                this.onComplete         = arguments[0].onComplete         || defaultParams.onComplete

                break;

            default:
                error( 'unexpected type of argument: expected "string" or "object", received ' +
                typeof arguments[0] );
        }
    };

    // Set up inheritance from BasicClass so that it's functions will be available to anything using ProgressBar
    ProgressBar.prototype = Object.create(BasicClass.prototype);

    // But we still want to use the ProgressBar constructor, not the BasicClass constructor. We can call the BasicClass
    // constructor from within the ProgressBar constructor.
    ProgressBar.prototype.constructor = ProgressBar;

    ProgressBar.prototype.show = function () {
        // FIXME: change this conditional so that the first block isn't empty
        // See if we need to set current back to its default value
        if( arguments && arguments[0] && typeof arguments[0] === "object" && arguments[0].resetProgress === false ) {

        }
        else {
            this.current = 0;
        }

        var progressFraction = this.current + '/' + this.total;

        $.blockUI({

            message: ['<p class="loading-text">', this.title, '</p>' +
            '<p class="progress-fraction">' + progressFraction + '</p>' +
            '<div class="progress" data-loaded="' + this.current + '/' + this.total + '">' +
            '<span class="js-progress progress-meter"></span></div>'
            ].join(''),

            css: {
                top:    ( $( window ).height() - 85 ) / 2 + 'px',
                left:   ( $( window ).width() - 325 ) / 2 + 'px',
                width:  '325px',
                cursor: 'wait'
            },

            overlayCSS: {
                backgroundColor: '#FFF',
                opacity:         0.9
            },

            blockMsgClass: 'loading-indicator-trigger'
        });

        // Initialize the width
        var widthPct = ( this.current / this.total ) * 100;
        $( '.progress-meter' ).attr( 'style', 'width:' + widthPct + '%' );
    };

    ProgressBar.prototype.increment = function () {

        if( arguments && arguments[0] && typeof ( arguments[0] === "string" || typeof arguments[0] === "number" ) ) {
            this.current += +arguments[0];
        }
        else {
            this.current++;
        }

        var progressFraction = this.current + '/' + this.total;
        $( '.progress-fraction' ).html( progressFraction );

        var widthPct = this.current / this.total * 100;
        $( '.progress-meter' ).attr( 'style', 'width:' + widthPct + '%' );

        // See if the process is complete and whether or not we should close the dialog
        if( this.current >= this.total && this.closeOnComplete ) {

            // Close the dialog after a set interval of time so that the user can see the full progress bar for a moment
            setTimeout( function () {
                // TODO: onComplete() gets called before hide() for some reason
                this.hide();
                this.onComplete && this.onComplete();
            }.bind( this ), this.timeToShowComplete);
        }
    };

    ProgressBar.prototype.hide = function () {
        $.unblockUI();
    };

    return ProgressBar;
}));