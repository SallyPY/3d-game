# 3d-game: Rescue!
Project for AIT-Budapest's graphics course
<h2> Game Objective </h2>

The objective is to collect/rescue the three missing baby slowpokes and return them to their mom,
who is frozen and needs them to be revived. The user must avoid a hot air balloon that is following
the user-controlled helicopter or else lose.

<h2>Images</h2>

![Alt text](/pics/game1.png?raw=true "Game pic one")
![Alt text](/pics/game3.png?raw=true "Game pic three")


<h2>Description</h2>

Note: Many trees are placed randomly so if any obstructs your vision please refresh the window.

The user navigates the helicopter.
Keys: <br>
<b>
J = left <br>
L = Right <br>
K = Forward <br>
I = Back <br>
U = Down <br>
O = Up <br>
</b>

With collision physics, when the helicopter collides with a slowpoke, the slowpoke disappears/is rescued.

There is a single directional light source. There are two point lights on the frozen slowpoke
mom. One point light on the slowpoke is moving, which makes for a cool visual effect.

Objects are shaded with both diffuse and Phong-Blinn shading. Some objects like the helicopter
and tree are shinier than others.

The hot air balloon attached to a slowpoke is reflecting the environment/background texture. The other balloons
are also, but with procedural normal mapping too. The trees and slowpokes have shadows, all affected by the same light direction.

The trees have procedural texturing in the form of stripes, while the two hot air balloons have bumpy surfaces with procedural solid texturing. The surface of the moving balloon changes as
the noise function depends on world position.
