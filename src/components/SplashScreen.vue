<template>
  <div class="splash-screen">
    <div class="splash-logo">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00B4D8"
        stroke-width="1.8"
        stroke-linecap="round"
      >
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.3.5 2.5 1"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.3.5 2.5 1"/>
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.3.5 2.5 1"/>
      </svg>
    </div>

    <h1>SeaWatch</h1>
    <p>Pemantauan Laut &amp; Observasi Pesisir</p>

    <div class="splash-dots" aria-label="Memuat aplikasi">
      <span
        v-for="index in 3"
        :key="index"
        class="dot"
        :style="{ animationDelay: `${(index - 1) * 180}ms` }"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.splash-screen {
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 0 24px;
  text-align: center;

  background: linear-gradient(
    160deg,
    #0A2342 0%,
    #0E3A6B 78%,
    #EEF4FB 100%
  );
}

.splash-logo {
  width: 80px;
  height: 80px;

  margin-bottom: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 24px;

  background: rgba(0, 180, 216, 0.2);
  border: 1px solid rgba(0, 180, 216, 0.4);
}

.splash-screen h1 {
  margin: 0 0 8px;

  color: white;

  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 28px;
  font-weight: 400;
}

.splash-screen p {
  margin: 0;

  color: #90C4E8;

  font-size: 14px;
}

.splash-dots {
  display: flex;
  align-items: center;
  gap: 6px;

  margin-top: 32px;
}

.dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #00B4D8;

  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>