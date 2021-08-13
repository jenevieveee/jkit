# JKit Style Guide

*These are mostly for me, and I'm not very good about enforcing my own rules*

* Camel Case for global variables and functions.
* Global variables should employ System Hungarian notation for types used in a primitive context.
    * *b* for variables used as booleans, *i* for int, and *f* for float, and *s* for string.
    * Weak-typed languages make development fast, and debugging suck. 
* Module functions should use the style <function name>_<module> if there's any chance of a collision.
    * For example, setTimer_*x* is used in several functions; these should be named setTimer_goon, setTimer_boss, etc.
* Internal, local variables can follow any convention, except as follows:
    * Counters should use FORTRAN variable types (i.e. starting at i, j, k, etc.)
    * Iterators should use single/plural notation (i.e. for (key in (keys)) )
        * If a word is its own plural, use curr_*item* (i.e. for (curr_sheep in (sheep)) )
* Stored settings should be named *module*settings
    * dashsettings, goonsettings, etc.
* Try to keep lists of modules in alphabetical order in code
    * For example, boss should always proceed dash, unless there is a good reason.
* Images should go into a subfolder under img based on module name.
* CSS filenames should be Pascal Case for small tweaks, all lower for skins and full-page changes.

