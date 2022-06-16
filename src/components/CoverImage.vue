<script setup lang="ts">
import { reactive } from "vue";

interface Props {
  subtitle: string;
  imageUrl: string;
  perspectiveAngle: number;
}
const props = withDefaults(defineProps<Props>(), {
  subtitle: "",
  imageUrl: "",
  colorTest: "blue",
  perspectiveAngle: 25,
});

const css = reactive({
  backgroundUrl: `url(${props.imageUrl})`,
});
</script>

<template>
  <div class="thumb">
    <a href="#">
      <span>{{ props.subtitle }}</span>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.thumb {
  width: 300px;
  height: 300px;
  margin: 70px auto;
  perspective: 1000px;
}

.thumb a {
  --propBackground: v-bind("css.backgroundUrl");
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    var(--propBackground);
  background-size: 0, cover;
  transform-style: preserve-3d;
  transition: all 0.5s;
}

.thumb:hover a {
  transform: rotateX(calc(v-bind("props.perspectiveAngle") * 1deg));
  transform-origin: bottom;
}
.thumb a:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 36px;
  background: inherit;
  background-size: cover, cover;
  background-position: bottom;
  transform: rotateX(90deg);
  transform-origin: bottom;
}
.thumb a span {
  color: white;
  text-transform: uppercase;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  font: bold 12px/36px "Open Sans";
  text-align: center;
  transform: rotateX(-89.99deg);
  transform-origin: top;
  z-index: 1;
}
.thumb a:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 100px 50px rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
  opacity: 0.15;
  transform: rotateX(95deg) translateZ(-80px) scale(0.75);
  transform-origin: bottom;
}

.thumb:hover a:before {
  opacity: 1;
  box-shadow: 0 0 25px 25px rgba(0, 0, 0, 0.5);
  transform: rotateX(0) translateZ(-60px) scale(0.85);
}
</style>
