import "virtual:windi.css";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import CSSPlugin from "gsap/CSSPlugin";
import Landolt from "./landolt.svg";
import lottie from "lottie-web";
import { onMount, createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
// import LottieCat from './lottie/cat'
// import LottieDog from "./lottie/dog.json";
// import LottieFish from "./lottie/fish.json";
import mp3success from "../public/mp3/correct.mp3";
import mp3fail from "../public/mp3/wrong.mp3";
import mp3cat from "../public/mp3/cat.mp3";
import mp3dog from "../public/mp3/dog.mp3";
import mp3bird from "../public/mp3/bird.mp3";
import mp3fish from "../public/mp3/fish.mp3";

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
  let entities = {
    top: { container: undefined, audio: new Audio(mp3dog), anim: undefined },
    right: { container: undefined, audio: new Audio(mp3fish), anim: undefined },
    bottom: {
      container: undefined,
      audio: new Audio(mp3bird),
      anim: undefined,
    },
    left: { container: undefined, audio: new Audio(mp3cat), anim: undefined },
  };

  let landolt, pathRef, spinAnim, throwAnim, cake;
  let audioSuccess = new Audio(mp3success),
    audioFail = new Audio(mp3fail);

  const [size, setSize] = createSignal(0);
  const [direction, setDirection] = createSignal("right");
  const [dpi, setDpi] = createSignal(96);
  const [isWindowSmall, setWindowSmall] = createSignal(false);
  let [sizes, setSizes] = createStore([
    {
      vision: "1m 0.1",
      mm: 14.544,
      get inches() {
        return this.mm / 25.4;
      },
      get px() {
        return dpi() * this.inches;
        // return dpi() * this.inches;
      },
    },
    {
      vision: "1m 0.4",
      mm: 3.636,
      get inches() {
        return this.mm / 25.4;
      },
      get px() {
        return dpi() * this.inches;
      },
    },
    {
      vision: "1m 0.8",
      mm: 1.818,
      get inches() {
        return this.mm / 25.4;
      },
      get px() {
        return dpi() * this.inches;
      },
    },
  ]); // 3m

  // createEffect(() => {
  //   // setSize(sizes()[0].pixels);
  //   console.log("effect: ");
  //   console.log(sizes);
  // });

  const _setLocalDpi = (v) => {
    window.localStorage.setItem("dpi", v);
    setDpi(v);
  };

  const _getDirectionByDegree = (degree) => {
    if (degree === 90) return "bottom";
    if (degree === 180) return "left";
    if (degree === 270) return "top";
    if (degree === 360 || degree === 0) return "right";
  };
  const _spin = () => {
    if (spinAnim?.isActive()) return;

    let r, d;
    do {
      r = Math.floor(Math.random() * 4) * 90;
      d = _getDirectionByDegree(r);
    } while (direction() === d);
    setDirection(d);

    spinAnim = gsap
      .timeline()
      .to(landolt, {
        rotation: `+=${360 * 7 + r}`,
        // ease: "spin",
        // ease: "power3.inOut",
        ease: "expo.in",
        // ease: "back.in(1.1)",
        duration: 1.3,
      })
      .to(
        pathRef,
        {
          attr: {
            d: "M 99.4 73.5 H 126 c -4.9 30.2 -31 53.2 -62.6 53.2 C 28.4 126.8 0 98.4 0 63.4 S 28.4 0 63.4 0 C 95 0 121.1 23.1 126.8 53.3 H 126.8 v 20.2 z",
          },
          duration: 0.3,
        },
        "<"
      )
      .set(landolt, { rotation: r }, 1.3)
      .set(pathRef, {
        attr: {
          d: "M 99.4 73.5 H 126 c -4.9 30.2 -31 53.2 -62.6 53.2 C 28.4 126.8 0 98.4 0 63.4 S 28.4 0 63.4 0 C 95 0 121.1 23.1 126 53.3 H 99 v 20.2 z",
        },
      });
  };
  const _throwCake = async (_direction) => {
    if (throwAnim?.isActive()) return;
    if (_direction === direction()) _playSuccess(entities[_direction].audio);
    else _playFail(entities[_direction].audio);
    // _playAudio(audio)
    throwAnim = gsap
      .timeline()
      .call(() => entities[_direction].anim.play())
      .set(cake, { width: 10 })
      .to(cake, { width: 150, ease: "power1.out", duration: 1 })
      .to(cake, { width: 0, ease: "power1.in", duration: 1 })
      .to(cake, { rotation: `+=${360 * 2}`, ease: "expo.in", duration: 2 }, 0)
      .call(() => entities[_direction].anim.pause(), [], 3);

    if (direction() === "right")
      throwAnim.to(cake, { translateX: "11cm", duration: 2.25 }, 0);
    else if (direction() === "left")
      throwAnim.to(cake, { translateX: "-7cm", duration: 2.25 }, 0);
    else if (direction() === "top")
      throwAnim.to(cake, { translateY: "-8cm", duration: 2.25 }, 0);
    else if (direction() === "bottom")
      throwAnim.to(cake, { translateY: "8cm", duration: 2.25 }, 0);

    throwAnim
      .set(
        cake,
        {
          rotate: 0,
          // translateX: 1 / 2,
          // translateY: 1 / 2,
          translateX: 0,
          translateY: 0,
          // translateY: 1 / 2,
          xPercent: -50,
          yPercent: 50,
          // transform: "none",
        },
        ">.3"
      )
      .to(cake, {
        width: sizes[size()].px / 2.3 + "px",
        ease: "back.out(2.7)",
        duration: 0.7,
      });
  };

  const _checkWindowSize = () => {
    if (document.body.scrollHeight > document.body.clientHeight)
      setWindowSmall(true);
    else if (document.body.scrollWidth > document.body.clientWidth)
      setWindowSmall(true);
    else setWindowSmall(false);
  };

  const _playAudio = (audio) => {
    return new Promise((res) => {
      audio.play();
      audio.onended = res;
    });
  };

  const _playFail = async (audio) => {
    await _playAudio(audioFail);
    _playAudio(audio);
  };
  const _playSuccess = async (audio) => {
    await _playAudio(audioSuccess);
    _playAudio(audio);
  };

  onMount(() => {
    //_checkWindowSize();
    window.addEventListener("resize", _checkWindowSize);

    setDpi(window.localStorage.getItem("dpi") || 96);

    // console.log(
    //   "Your screen resolution is: " +
    //     window.screen.width * window.devicePixelRatio +
    //     "x" +
    //     window.screen.height * window.devicePixelRatio
    // );

    entities.top.anim = lottie.loadAnimation({
      container: entities.top.container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      // path: "https://assets4.lottiefiles.com/packages/lf20_F2Mv1p.json",
      path: "./lottie/dog.json",
    });
    entities.right.anim = lottie.loadAnimation({
      container: entities.right.container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      // path: "https://assets3.lottiefiles.com/packages/lf20_zxfaytb8.json",
      path: "./lottie/fish.json",
    });
    entities.bottom.anim = lottie.loadAnimation({
      container: entities.bottom.container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      // speed: 3.2,
      // path: "./lottie/bird.lottie",
      path: "./lottie/bird.json",
      // path: "https://assets4.lottiefiles.com/packages/lf20_lc46h4dr.json",
    });
    entities.left.anim = lottie.loadAnimation({
      container: entities.left.container,
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
            <For each={sizes}>
              {(_size, i) => (
                <div
                  onClick={() => setSize(i())}
                  class={`cursor-pointer border py-1 px-2 select-none outline-none flex justify-center ${
                    size() === i() ? "bg-gray-200" : ""
                  }`}
                >
                  {_size["vision"]}
                </div>
              )}
            </For>
            <div class="mt-4">
              <input
                class="border py-1 px-2 flex justify-center outline-none w-16 text-gray-500 focus:text-black"
                type="text"
                value={dpi()}
                onInput={(e) => _setLocalDpi(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div class="relative">
          {/* Landolt */}
          <div
            class="flex justify-center items-center cursor-pointer"
            // style="height: 5cm; width: 5cm;"
            style={{
              width: "117mm",
              height: "117mm",
            }}
            onClick={_spin}
          >
            <svg
              //class="h-full w-full"
              style={{
                width: sizes[size()].px + "px",
                height: sizes[size()].px + "px",
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
            style={{ width: sizes[size()].px / 2.3 + "px" }}
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
            class="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
            style="height: 8cm; width: 8cm; top: -6cm;"
            ref={entities.top.container}
            onClick={() => _throwCake("top")}
          />

          {/* Animal right */}
          <div
            class="absolute top-1/2 transform -translate-y-1/2 cursor-pointer"
            style="height: 8cm; width: 8cm; left: 10.5cm;"
            ref={entities.right.container}
            onClick={() => _throwCake("right")}
          />

          {/* Animal bottom */}
          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 cursor-pointer"
            style="height: 12cm; width: 12cm; top: 8cm;"
            ref={entities.bottom.container}
            onClick={() => _throwCake("bottom")}
          />

          {/* Animal left */}
          <div
            class="absolute top-1/2 transform -translate-y-1/2 cursor-pointer"
            style="height: 8cm; width: 8cm; left: -6.5cm;"
            ref={entities.left.container}
            onClick={() => _throwCake("left")}
          />
        </div>
      </div>
    </main>
  );
}
