DEVIANT = {

	images: [],
	pauseTime: 3000,
	pause: false,
	current: -1,
	offset: 0,
	timer: null,

	client: {
		id: "2718",
		secret: "b51c2fff9d3f211bb074c89ded60b019"
	},

	launchFullscreen: function ( element )
	{
		if( element.requestFullscreen )
		{
		  element.requestFullscreen();
		}
		else if( element.mozRequestFullScreen )
		{
		  element.mozRequestFullScreen();
		}
		else if( element.webkitRequestFullscreen )
		{
		  element.webkitRequestFullscreen();
		}
		else if( element.msRequestFullscreen )
		{
		  element.msRequestFullscreen();
		}
		else
		{
			console.log( "EAD!" );
		}
	},

	exitFullscreen: function()
	{
		if( document.exitFullscreen )
		{
		  document.exitFullscreen();
		}
		else if( document.mozCancelFullScreen )
		{
		  document.mozCancelFullScreen();
		}
		else if( document.webkitExitFullscreen )
		{
		  document.webkitExitFullscreen();
		}
	},

	init: function()
	{
		$(document).keydown( function(event) { DEVIANT.handleKeypress( event ); } );

		this.launchFullscreen( $("#content_item" ) );
		this.startSlideShow();

/*
jQuery.support.cors = true;
var myUrl = 'https://www.deviantart.com/oauth2/token?client_id=' + this.client.id + '&client_secret=' + this.client.secret + '&grant_type="client_credentials"';
console.log( myUrl );
$.getJSON( myUrl, function( data ) {
	console.log(JSON.stringify(data));
});
		var options = {
			type: "GET",
			url: myUrl,
			dataType: "text",
			crossDomain: true,
			error: function(data) { console.log( 'error', data.responseHeader ); },
			success: function(data) { console.log( 'success', data ); },
			complete: function() { console.log( 'complete' ); },
//			url: "https://www.deviantart.com/oauth2/token",
//			data: 'client_id=' + this.client.id + '&client_secret=' + this.client.secret + '&grant_type="client_credentials"',
		};

console.log( options.url );
		$.ajax( options )
		 .then( function( data ) {
			 console.log( "sigh" );
		 })
		 .done( function( data ) {
			 console.log( "Token?" );
			 console.log( data );
		 })
		 .fail( function( jqXHR, textStatus, errorThrown ) {
			 console.log( jqXHR );
			 console.log( textStatus );
			 console.log( errorThrown );
		 });
*/
	},

fileSave: function (fileURL, fileName) {
	console.log("Wee", fileURL, fileName);
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || fileURL;
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
            false, false, false, false, 0, null);
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, "_blank");
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
},

fileSave3: function(fileUrl, fileName) {
	console.log( fileUrl, fileName );
    var hyperlink = document.createElement('a');
    hyperlink.href = fileUrl;
    hyperlink.target = '_blank';
    hyperlink.download = fileName || fileUrl;

    var mouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(mouseEvent);
    (window.URL || window.webkitURL).revokeObjectURL(hyperlink.href);
},

	fileSave2: function(fileURL, fileName)
	{
        // for non-IE
    if (!window.ActiveXObject) {
		console.log( "Saving: ", fileURL, " to ", fileName );
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || 'unknown';

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
	},

	handleKeypress: function( key )
	{
		// p key
		if( key.which == 80 || key.which == 32 )
		{
			if( this.pause )
			{
				this.pause = false;
				$( "#content_status" ).text( "" );
				this.timer = setTimeout( function(){ DEVIANT.showImages(); }, this.pauseTime );
			}
			else
			{
				this.pause = true;
				$( "#content_status" ).text( "Paused" );
				clearTimeout( timer );
			}
		}
		// t key
		else if( key.which == 84 )
		{
//			window.open( this.images[this.current], '_blank' );

var splits = this.images[this.current].split(/\//);
console.log( splits[splits.length - 1] );
			this.fileSave( this.images[this.current], splits[splits.length - 1] );
		}
		else
		{
			console.log( "Unhandled keypress: ", key.which );
		}
	},

	startSlideShow: function()
	{
		images = [];
		current = -1;
		$.when( this.loadImages() )
		 .then( function() {
			 DEVIANT.showImages();
		 });
	},

	loadImages: function()
	{
		var dfr = $.Deferred();

		//var site = "http://backend.deviantart.com/rss.xml?q=special:dd";
		var site = "http://backend.deviantart.com/rss.xml?q=boost%3Apopular+meta%3Aall+max_age%3A24h&amp;type=deviation&offset=" + this.offset;
		console.log( site );
		var url = "http://query.yahooapis.com/v1/public/yql?q=" +
				  encodeURIComponent('select * from xml where url="' + site + '"') +
				  "&format=xml&callback=?";
//		console.log( url );

		$.getJSON( url )
		 .done( function( data ) {
			 if( data.results[0] )
			 {
				$( data.results[0] ).find( "media\\:content" ).each( function() {
					DEVIANT.images.push( $( this ).attr( "url" ) );
				});

				dfr.resolve();
			 }
			 else
			 {
				 dfr.reject();
				 throw new Error( "Nothing returned from getJSON." );
			 }
		 })
		 .fail( function() {
			 dfr.reject();
			 throw new Error( "getJSON failed." );
		 });

		 return dfr.promise();
	},

	showImages: function()
	{
		if( this.current < this.images.length )
		{
			if( !this.pause )
			{
				$( "#content_item" ).attr( "src", this.images[++this.current] );
				this.timer = setTimeout( function(){ DEVIANT.showImages(); }, this.pauseTime );
			}
		}
		else
		{
			this.offset += this.current;
			this.startSlideShow();
		}
	},

}
