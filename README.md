## Summary
ProgressBar is a quick and simple modal dialog that displays a progress indicator bar. The progress bar can be programmatically incremented and the dialog itself can be shown or hidden at any time.

* <a href="#wiki-basicUsage">**Basic Usage**</a>
* <a href="#wiki-options">**Options**</a>
* <a href="#wiki-methods">**Methods**</a>

## <a name="basicUsage"></a>Basic usage

If loaded as a standalone script (meaning the progress-bar script is loaded via a `<script>` tag and an AMD loader is not present on the page), a ProgressBar object can be instantiated like this:
```javascript
var uploadProgress = new ProgressBar({
          title:   'Files uploading...',
          current: 0,
          total:   10
        });
```

ProgressBar can also be loaded via an AMD loader (e.g. RequireJS). Once loaded, the ProgressBar reference can be used to create an instance of a customized ProgressBar like this:

```javascript
define([
    'components/progress-bar'
    ],

    function ( ProgressBar ) {

        var uploadProgress = new ProgressBar({
          title:   'Files uploading...',
          current: 0,
          total:   10
        });

    });
```

You can display the progress bar dialog by calling the `show()` method, increase the progress by calling the `increment()` method, and close the dialog by calling the `hide()` method.
```javascript
uploadProgress.show();

uploadProgress.increment();

uploadProgress.hide();
```

## <a name="options"></a>Options

These options can be defined in the constructor upon the creation of a ProgressBar object, or set using the `set()` method after a ProgressBar object is instantiated.

|Option|Type|Default|Description|
|------|----|-------|-----------|
|title|string|""|The text that will be displayed at the top of the dialog. Can be left empty if no title is desired.|
|current|number|0|The current progress of the process whose status is being tracked. As this is increased, the progress bar will fill. Progress is shown as a percentage of current / total.|
|total|number|1|The total number of measurable steps in the process being tracked. Progress is shown as a percentage of current / total.|
|closeOnComplete|boolean|false|When `current` reaches `total`, the dialog will close if this option is set to `true`.|
|onComplete|function|undefined|The callback that will get executed once `current` reaches `total`. Note that this will only get executed if `closeOnComplete` is `true`, since it is assumed that you will handle closing the dialog and executing any callbacks if `closeOnComplete` is `false`. Gets executed after the `timeToShowComplete` interval.|
|timeToShowComplete|number|100|The time (in milliseconds) to show the dialog after `current` has reached `total`. This only applies if `closeOnComplete` is set to `true`.| 

## <a name="methods"></a>Methods

####Constructor

Takes in any of the described <a href="#wiki-options">options</a> as input and returns a new instance of a ProgressBar.

```javascript
var uploadProgress = new ProgressBar({
  title:   'Files uploading...',
  current: 0,
  total:   10
});
```

####show()

Opens the dialog modal. Takes a boolean value `resetProgress` as optional input which, if false, causes `current` to not be reset to zero.

```javascript
// If there is any current progress, it will be reset after this statement
// executes
uploadProgress.show();

// Any current progress will not be reset after this statement executes
uploadProgress.show({
  resetProgress: false
});
```

####increment()

Takes a string or number as optional input which specifies the amount to increment the current progress. If no input is specified, increments the progress by one.

```javascript
// Increments the progress by one
uploadProgress.increment();

// Increments the progress by 5
uploadProgress.increment(5);

// Also valid
uploadProgress.increment("5");
```

####hide()

Closes the dialog.
```javascript
// Dialog will close after this statement executes
uploadProgress.hide();
```

####set()

Sets one or more options in the ProgressBar object.
```javascript
// Changes the total to 100
var total = 100;
uploadProgress.set('total', total);

// Can also change multiple options at one time
uploadProgress.set({
    total: 100,
    title: 'New title',
    closeOnComplete: true
});
```

####get()

Returns the value of an option
```javascript
// Returns the value of 'total'
uploadProgress.get('total');
```
