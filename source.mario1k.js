// JSCrush Variable, needed to run the entry, but remove them before compress it.
Y = 0;
$ = "";

// Initialize global vars
i=r=s=u=y=0;

// Create sprite
for(
	k=a.createImageData(91,16); // Create pixel array (size : 91*16)
	5824 > i;                   // loop the pixel array : i < 91*16*4
	i+=4                        // jump to the next pixel
) {
	// Here we just modify the alpha
	// if the bin[index] is 8 the pixel is opaque ( 1<<8 == 256 ) else transparent (1<<0 == 0).
	k.data[i+3] = 1<<"0008888880000000088888800000088888800000008888880000000888888000008000000008800888888888880008888888888000088888888880088888888880008888888888000888888888000088888888808888888888888800888008000000008880080000008880080000000888008000000088800800888008888888880888888888888880808000800000008080008000008080008000000808000800000080800080088800888888888088888000008888080880008000000808800080000808800080000080880008000008088000800080088888888808888008880088808800008888800088000088888088000088888008800008888800880000888888008888888888888800888008880000000000000000000000000000000000000000000000000000000000000088000888888888008880088800888008888888000000088888880000088888880000888888888000088888888888000088888888808888888800088808888888888800008888880000088888888800088888888880008888888888808008888888880888888800888888888888888888000888888000008888808800000088808888800888888888880800888888888088888880088888008808808800008888888888000888888888800008888888808808888808808880888888888088888888888888800088888800000888888888800088800088880008888888888888888888888888000888888808888888800888880088888888000888888888800000880088880008888888888888888888888888800800888808888888880088888008888088880088000888800000008888888000888880088888888888888800000088800080888888888888888808888000888800000088888000000888888880088800000000000888880000000008888888088888888888888888888800088888000000000000000088888000008888000000000000000000000008888888808880000000000000"[i>>2]; // huhu, i>>2 can be replace to i/4 to gain 1 byte...
}


// Put pixels in a new canvas (referenced as "m").
// x=150 : where mario will spam.
(m=c.cloneNode(x=150)).getContext("2d").putImageData(k,0,0);

// Note:
// If you want to see the mario sprite, just uncomment the next line.
// b.appendChild(m);


// Render loop (don't use function(){<code>} to gain some bytes.
setInterval(

	// Reset some needed variables
	// i: x pos in the context to draw
	// b: boolean, true if a block in the next cell (stop moving)
	"i=b=0;"

	// Loop throw the scene to render all blocks
	// for(x=0;x<width; x++)
	//   for(y=0; y<height; y++)
	// g=c.width=300 : clean up the context, set g to 300 (collision with ground, if the g is not set later, mario will fall to 300px)
+	"for(g=c.width=300;24>i;i++)"
+		"for(j=6;--j;)"

			// Now some Maths to set the cells on ground based on some random
			// Optimized to have the token "j&&(i-5+x/13)%" (will be removed by jsCrush).
+			"if(2>j&&(i-5+x/13)%20>3||5>j&&(i-5+x/13)%57>35+j&&(i-5+x/13)%53<50-j||4<j&&(i-5+x/13)%26>25)"

				// Draw sprite element:
				// if y < 5 draw ground
				// else draw cube [?]
				// Did you see ? "150-16*j-0" : the "-0" part is here to save 1 byte by adding 2bytes because of the multiple reference of "150-16*j-" in the script.
+				"a.drawImage(m,13*(5>j?5:6),0,13,16,13*i-x%13,150-16*j-0,13,16),"

				// Check top-bottom collision, some optis:
				// "(s=13,160)" -> 160 was choose to get the token "13,16" again.
				// "150-16*j-16" -> can be optimized to "150-17*j" but I want to get the same token again and again.
+				"g=10==i&&13>Math.abs(150-16*j-y-5)?150-16*j-16+(s<0)*(s=13,160):g,"

				// Check left-right collision
				// Token "=10==i&&13>Math.abs(150-16*j-y" (see the line before)
				// so this line should just be 5bytes :)
+				"b+=10==i-r&&13>Math.abs(150-16*j-y);"
		// endfor;
	// endfor;

	// Player fall in a hole:
	// - move the camera at the start.
	// - re-initialize player direction (look at right)
	// - when at start, move mario at the top to fall from sky.
+	"150<=y&&(x-=50,$=1,y=150>x?(x=150,-20):y);"

	// If no collision, walk to the left or right !
	// 4.8 is used because of some visual bugs (it seems to hide them a little :p)
+	"b||(x+=4.8*r);"

	// Jump feature with ground collision
+	"a.save(s=y<g|0>s?8>s++?s:8:(y=g,-11*u));"

	// Now rendering the mario sprite, we need to move to his position for the scale feature and apply the jump.
+	"a.translate(130,y+=s);"

	// Scale mario to the direction he looks at.
	// $ is a JSCrush variable string, |1 is used because I don't set $ to -1 or 1 at the start (so ""|1 == 1).
+	"a.scale($|1,1);"

	// Draw Mario sprite and change it's animation base on the time (depend if it jump or not)
	// (I use here Y variable (int) from JScrush as a tick var to save some bytes (don't need to set another variable - save 2 bytes).
+	"a.restore(a.drawImage(m,13*(s?4:r?++Y%3:0),0,13,16,-6,0,13,16))"
,30);


// Keys management
onkeyup=onkeydown=function(b){

	// Jump : set "u" to 1 or 0 (if key is down or not)
	u = b.keyCode-38 ? u : !!b.type[5]

	// Left-Right
	// set "$" (mario look at) to 1 (right) or -1 (left)
	// set "r" (mario movement) to 1 (right) | 0 (don't move) | -1 (left)
	r = b.keyCode-37 ? b.keyCode-39 ? r : ($=1,!!b.type[5]) : ($=-1,-!!b.type[5])
}