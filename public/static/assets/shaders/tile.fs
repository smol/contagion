uniform int selected;

void main() {
	if (selected == 1)
		gl_FragColor = vec4(0.0, 1.0, 0.0, 0.5);
	else
		gl_FragColor = vec4(1.0, 1.0, 0.0, 0.0);
}
