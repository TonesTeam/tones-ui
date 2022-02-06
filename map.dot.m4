divert(-1)
define(`login',`"Login Page"')
define(`prfsettings',`"Profile Settings"')
define(`syssettings',`"System Settings"')
define(`prtlist',`"Protocol List"')
define(`prthist',`"Protocol History"')
define(`prtpage',`"Protocol Creation/View Page"')
define(`prtstart',`"Protocol Start Page"')
define(`prtreq',`"Protocol Requirements Page"')
define(`prtstatus',`"Protocol Status Page"')
define(`navbar',`"Navigation Bar"')
divert(0)


digraph {
    splines = ortho
    node [shape=rectangle,fixedsize=false]
	login -> prtlist
	prtlist [width=3]
	{rank = same; navbar;login;}

	navbar -> prtlist [dir=both]
	navbar -> prthist [dir=both]
	navbar -> prfsettings [dir=both]
	navbar -> syssettings [dir=both]

	prtlist -> prtpage [taillabel="ro\n (view)"]
	prtlist -> prtpage [taillabel="rw\n (edit)"]
	prtlist -> prtpage [taillabel="rw\n (copy)"]
	prtlist -> prtstart

	prtpage -> navbar 
	prtpage -> prtstart
	prtstart -> prtreq
	prtreq -> prtstatus

	
}
