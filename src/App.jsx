import "virtual:windi.css";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import CSSPlugin from "gsap/CSSPlugin";
import Landolt from "./landolt.svg";
import lottie from "lottie-web";
import { onMount, createSignal } from "solid-js";
// import LottieCat from './lottie/cat'
// import LottieDog from "./lottie/dog.json";
// import LottieFish from "./lottie/fish.json";

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(MotionPathPlugin);
CSSPlugin.useSVGTransformAttr = true;

CustomEase.create(
  "spin",
  "M0,0,C0.25,0,0.294,0.023,0.335,0.05,0.428,0.11,0.624,0.4,0.766,0.586,0.916,0.782,0.914,0.784,0.948,0.848,1,0.946,0.972,0.884,1,1"
);

/*
pidgeon - https://assets4.lottiefiles.com/packages/lf20_F2Mv1p.json
octopus - https://assets3.lottiefiles.com/packages/lf20_zxfaytb8.json
tiger - https://assets4.lottiefiles.com/packages/lf20_lc46h4dr.json
*/

export default function App() {
  let anim1Container,
    anim2Container,
    anim3Container,
    anim4Container,
    landolt,
    pathRef,
    spinAnim,
    throwAnim,
    cake;
  let anim1, anim2, anim3, anim4;
  // let [sizes, setSized] = createSignal([0.732, 0.582, 0.462, 0.361, 0.287]); // 40sm
  let [sizes] = createSignal([
    { vision: 0.1, size: 50.24 },
    { vision: 0.4, size: 12.56 },
    { vision: 0.8, size: 6.28 },
    { vision: 1.0, size: 5.024 },
  ]); // 3m

  const [size, setSize] = createSignal(sizes()[0].size);
  const [direction, setDirection] = createSignal("right");
  const [isWindowSmall, setWindowSmall] = createSignal(false);

  const _spin = () => {
    if (spinAnim?.isActive()) return;

    const r = Math.floor(Math.random() * 4) * 90;
    let d;
    if (r === 90) d = "bottom";
    if (r === 180) d = "left";
    if (r === 270) d = "top";
    if (r === 360 || r === 0) d = "right";
    setDirection(d);

    spinAnim = gsap
      .timeline()
      .to(landolt, {
        rotation: `+=${360 * 7 + r}`,
        // ease: "spin",
        // ease: "power3.inOut",
        ease: "expo.in",
        // ease: "back.in(1.1)",
        duration: 2,
      })
      .to(
        pathRef,
        {
          attr: {
            d: "M 99.4 73.5 H 126 c -4.9 30.2 -31 53.2 -62.6 53.2 C 28.4 126.8 0 98.4 0 63.4 S 28.4 0 63.4 0 C 95 0 121.1 23.1 126.8 53.3 H 126.8 v 20.2 z",
          },
          duration: 0.6,
        },
        "<"
      )
      .set(landolt, { rotation: r }, 2)
      .set(pathRef, {
        attr: {
          d: "M 99.4 73.5 H 126 c -4.9 30.2 -31 53.2 -62.6 53.2 C 28.4 126.8 0 98.4 0 63.4 S 28.4 0 63.4 0 C 95 0 121.1 23.1 126 53.3 H 99 v 20.2 z",
        },
      });
  };

  const _throwCake = (anim) => {
    if (throwAnim?.isActive()) return;
    throwAnim = gsap
      .timeline()
      .call(() => anim.play())
      .set(cake, {
        width: 10,
        height: 10,
        translateX: 1 / 2,
        translateY: -1 / 2,
      })
      .to(cake, {
        scale: 1,
        width: 150,
        height: 150,
        ease: "power1.out",
        duration: 1.25,
      })
      .to(cake, { width: 0, height: 0, ease: "power1.in", duration: 1.25 })
      .to(cake, { rotation: `+=${360 * 2}`, ease: "expo.in", duration: 2.5 }, 0)
      .call(() => anim.pause(), [], 3.5);

    if (direction() === "right")
      throwAnim.to(cake, { translateX: "11cm", duration: 2.25 }, 0);
    else if (direction() === "left")
      throwAnim.to(cake, { translateX: "-7cm", duration: 2.25 }, 0);
    else if (direction() === "top")
      throwAnim.to(cake, { translateY: "-8cm", duration: 2.25 }, 0);
    else if (direction() === "bottom")
      throwAnim.to(cake, { translateY: "8cm", duration: 2.25 }, 0);
  };

  const _checkWindowSize = () => {
    if (document.body.scrollHeight > document.body.clientHeight)
      setWindowSmall(true);
    else if (document.body.scrollWidth > document.body.clientWidth)
      setWindowSmall(true);
    else setWindowSmall(false);
  };

  onMount(() => {
    //_checkWindowSize();
    window.addEventListener("resize", _checkWindowSize);

    anim1 = lottie.loadAnimation({
      container: anim1Container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      // path: "https://assets4.lottiefiles.com/packages/lf20_F2Mv1p.json",
      path: "./lottie/dog.json",
    });
    anim2 = lottie.loadAnimation({
      container: anim2Container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      // path: "https://assets3.lottiefiles.com/packages/lf20_zxfaytb8.json",
      path: "./lottie/fish.json",
    });
    anim3 = lottie.loadAnimation({
      container: anim3Container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      // speed: 3.2,
      // path: "./lottie/bird.lottie",
      path: "./lottie/bird.json",
      // path: "https://assets4.lottiefiles.com/packages/lf20_lc46h4dr.json",
    });
    anim4 = lottie.loadAnimation({
      container: anim4Container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "./lottie/cat.json",
      // path: "https://assets4.lottiefiles.com/packages/lf20_4rvjxfox.json",
    });
  });

  return (
    <main class="">
      <div class="h-100vh w-full flex items-center justify-center relative">
        {/* <Show when={isWindowSmall()}>
          <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-1 flex justify-center items-center">
            <div class="text-3xl text-bold text-white">Window is too small</div>
          </div>
        </Show> */}

        <div class="absolute top-20px right-20px">
          <div class="flex flex-col">
            <For each={sizes()}>
              {(_size, i) => (
                <div
                  onClick={() => setSize(_size["size"])}
                  class={`cursor-pointer border py-1 px-2 select-none outline-none flex justify-center ${
                    size() === _size["size"] ? "bg-gray-200" : ""
                  }`}
                >
                  {_size["vision"]}
                </div>
              )}
            </For>
          </div>
        </div>

        <div class="relative">
          {/* Landolt */}
          <div
            class="flex justify-center items-center cursor-pointer"
            style="height: 5cm; width: 5cm;"
            onClick={_spin}
          >
            <svg
              //class="h-full w-full"
              style={{
                width: size() + "mm",
                height: size() + "mm",
              }}
              ref={landolt}
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              width="300"
              height="126.8"
              viewBox="0 0 126.8 126.8"
              xml:space="preserve"
            >
              <g>
                <path
                  ref={pathRef}
                  d="M 99.4 73.5 H 126 c -4.9 30.2 -31 53.2 -62.6 53.2 C 28.4 126.8 0 98.4 0 63.4 S 28.4 0 63.4 0 C 95 0 121.1 23.1 126 53.3 H 99 v 20.2 z"
                />
                <circle style="fill:#FFFFFF;" cx="63" cy="63.4" r="37.8" />
              </g>
            </svg>
          </div>
          {/* <Landolt> */}

          {/* <Cake> */}
          <div
            class="h-auto z-2 absolute left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-1/2 pointer-events-none select-none"
            style={{ width: size() / 2.3 + "mm" }}
            ref={cake}
          >
            {/* <img class="w-full h-full object-contain" src="/img/cake.png" /> */}
            <img
              class="w-full h-full object-contain"
              src="https://www.pngplay.com/wp-content/uploads/6/Banana-Vector-Transparent-PNG.png"
            />
          </div>
          {/* </Cake> */}

          {/* Animal top */}
          <div
            class="absolute left-1/2 transform -translate-x-1/2"
            style="height: 8cm; width: 8cm; top: -9.5cm;"
            ref={anim1Container}
            onClick={() => _throwCake(anim1, "top")}
          />

          {/* Animal right */}
          <div
            class="absolute top-1/2 transform -translate-y-1/2"
            style="height: 8cm; width: 8cm; left: calc(100% + 1.5cm);"
            ref={anim2Container}
            onClick={() => _throwCake(anim2, "right")}
          />

          {/* Animal bottom */}
          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2"
            // style="height: 12cm; width: 12cm; top: calc(100% + 1.5cm);"
            style="height: 12cm; width: 12cm; top: 4cm;"
            ref={anim3Container}
            onClick={() => _throwCake(anim3, "bottom")}
          />

          {/* Animal left */}
          <div
            class="absolute top-1/2 transform -translate-y-1/2"
            style="height: 8cm; width: 8cm; left: -9.5cm;"
            ref={anim4Container}
            onClick={() => _throwCake(anim4, "left")}
          />
        </div>
      </div>
    </main>
  );
}
