divert(-1)
define(`login',`"Login Page"')
define(`prfsettings',`"Profile Settings"')
define(`syssettings',`"System Settings"')
define(`libcomp',`"Library Component Settings"')
define(`prtlist',`"Protocol List"')
define(`prthist',`"History Page"')
define(`prtpage',`"Protocol Creation/View Page"')
define(`prtstart',`"Protocol Start Page"')
define(`prtreq',`"Protocol Requirements Page"')
define(`prtstatus',`"Protocol Status Page"')
define(`navbar',`"Navigation Bar"')
define(`reports',`"Reports Page"')
define(`clean',`"Washing Page"')
define(`startedprt',`"Running Protocols Page"')
define(`settings',`"Settings"')
divert(0)


digraph {
    splines = ortho
    node [shape=rectangle,fixedsize=false]
	login -> prtlist
	prtlist [width=3]
	prtpage [width=3]
	{rank = same; navbar;login;}

	navbar -> prtlist [dir=both]
	navbar -> prthist [dir=both]
	navbar -> settings

	settings -> libcomp [dir=both];
	settings -> prfsettings [dir=both];
	settings -> syssettings [dir=both];
	{rank="same";startedprt;prtlist;prthist;}

	navbar -> startedprt [dir=both]

	prtlist -> prtpage [taillabel="ro\n (view)"]
	prtlist -> prtpage [taillabel="rw\n (edit)"]
	prtlist -> prtpage [taillabel="rw\n (copy)"]
	prtlist -> prtstart

	prtpage -> navbar 
	prtpage -> prtstart
	prtstart -> prtreq
	prtreq -> startedprt

}
