
file = open("barchetta_a_vela.obj")



for linea in file.readlines():
	if(linea[0:2] == "v "):
		t = linea.split()
		print("vec4(%.2f, %.2f, %.2f, %.2f)," % (float(t[1])/4,float(t[2])/4,float(t[3])/4,1))

file.seek(0)
for linea in file.readlines():
	if(linea[0:2] == "f "):
		app = ""
		tokens = linea.split()
		n = 0
		for c in tokens[1:]:
			n = c.split("/")		
			app += str(int(n[0])-1) + ", "
		print("quad("+app+");")

file.seek(0)
for linea in file.readlines():
	if(linea[0:2] == "vt"):
		app = ""
		tokens = linea.split()
		print("vec2(%.2f, %.2f)," % (float(tokens[1]), float(tokens[2])))


file.seek(0)
for linea in file.readlines():
	if(linea[0:2] == "f "):
		tokens = linea.split()
		n = 0
		v = ""
		t = ""
		for c in tokens[1:]:
			n = c.split("/")		
			t += str((int(n[1])-1)) + ", "
			v += str((int(n[0])-1)) + ", "
		
		
			
		print("quadText("+v+t+");")
