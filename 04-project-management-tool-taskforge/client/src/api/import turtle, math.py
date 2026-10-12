import turtle as t, math as m, random as r, time
from PIL import Image, ImageDraw, ImageTk

W, H = 600, 700
SS = 2          # supersample factor -- render bigger, then downscale for anti-aliasing
SCALE = 100
BG = (5, 0, 2)

s = t.Screen(); s.setup(W, H); s.bgcolor("#050002"); s.tracer(0)
canvas = s.getcanvas()
img_id = canvas.create_image(0, 0, image=None)  # centered at (0,0), same as turtle's origin

def heart(u):
    x = 1.6 * (m.sin(u) ** 3)
    y = 1.3 * m.cos(u) - 0.5 * m.cos(2*u) - 0.2 * m.cos(3*u) - 0.1 * m.cos(4*u)
    return x, y

N = 1800
pts = []  # (tx, ty, tz, delay)
for _ in range(N):
    u = r.uniform(0, 2 * m.pi)
    hx, hy = heart(u)
    rad = m.sqrt(r.random())
    tx, ty = hx * rad, hy * rad
    tz = 1.1 * (1 - rad) * r.uniform(-1, 1)
    delay = r.uniform(0, 0.3)
    pts.append((tx, ty, tz, delay))

def get_col(f):
    f = max(0.0, min(1.0, f))
    r1, g1, b1 = 70, 0, 10
    r2, g2, b2 = 255, 30, 50
    return (int(r1+(r2-r1)*f), int(g1+(g2-g1)*f), int(b1+(b2-b1)*f))

def ease_out_cubic(x):
    return 1 - (1 - x) ** 3

def ease_in_quad(x):
    return x * x

SPREAD_DURATION = 2.2
MAX_DELAY = 0.3
MANIFEST_TIME = SPREAD_DURATION + MAX_DELAY
ROTATION_START_FRACTION = 0.4
ANGULAR_SPEED = 1.6
TARGET_ROTATIONS = 15

start_time = time.time()
theta = 0.0
last_t = 0.0
manifest_theta = None
stopped = False

def loop():
    global theta, last_t, manifest_theta, stopped, img_id

    now = time.time() - start_time
    dt = now - last_t
    last_t = now

    spread_progress = min(now / SPREAD_DURATION, 1.0)
    rot_frac = (spread_progress - ROTATION_START_FRACTION) / (1 - ROTATION_START_FRACTION)
    rot_frac = max(0.0, min(1.0, rot_frac))
    angular_speed_now = ANGULAR_SPEED * ease_in_quad(rot_frac)

    if not stopped:
        theta += angular_speed_now * max(dt, 0)

    if manifest_theta is None and now >= MANIFEST_TIME:
        manifest_theta = theta

    if not stopped and manifest_theta is not None:
        if theta - manifest_theta >= TARGET_ROTATIONS * 2 * m.pi:
            stopped = True

    ct, st = m.cos(theta), m.sin(theta)

    proj = []
    for tx, ty, tz, delay in pts:
        local_t = max(0.0, min((now - delay) / SPREAD_DURATION, 1.0))
        e = ease_out_cubic(local_t)
        x, y, z = tx * e, ty * e, tz * e
        xr = x * ct + z * st
        zr = -x * st + z * ct
        proj.append((xr, y, zr))

    proj.sort(key=lambda v: v[2])

    # render at 2x resolution, then downscale -- this is what smooths the dot edges
    big = Image.new("RGB", (W * SS, H * SS), BG)
    draw = ImageDraw.Draw(big)
    cx, cy = (W * SS) / 2, (H * SS) / 2

    for xr, y, zr in proj:
        depth = (zr + 1.1) / 2.2
        px = cx + xr * SCALE * SS
        py = cy - y * SCALE * SS
        rad = (2 + depth * 2.5) * SS
        col = get_col(depth)
        draw.ellipse([px - rad, py - rad, px + rad, py + rad], fill=col)

    small = big.resize((W, H), Image.LANCZOS)
    photo = ImageTk.PhotoImage(small)
    canvas.itemconfig(img_id, image=photo)
    canvas.image = photo  # keep a reference so it isn't garbage-collected

    canvas.update()

    if not stopped:
        s.ontimer(loop, 25)

loop()
t.mainloop()