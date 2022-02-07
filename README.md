# Tones UI
Repository for application page prototypes.
Some things to know:
* Fontawesome is utilized for icons. You can search em up here: https://fontawesome.com/v5.15/icons  
Of course you can add your own stuff if need be.
* It is preferable to minimize external dependencies for these prototypes. So for now, try to evade tempating frameworks like bootstrap.
* In case you are curious, build_dist.py is an ad-hoc python script for generating a portable html file, that I upload to google drive. It takes dependencies like images, js and css file links and embeds them into the target file (this script is very minimal and may fail pretty easily)  
To use it: `python build_dist.py protocol-list.html` and protocol-list.html will be generated and placed into dist folder.  

In case of any questions or issues with git/html/css/js, feel free to reach out :)  
Also, I would suggest working on a feature branch (unless you like to reset and rebase a lot with git). I shamelessly push to main and amend commits so keep that in mind.
