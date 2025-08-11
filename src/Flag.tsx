// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// interface FlagProps {
//   celebrate?: boolean;
// }

// const Flag: React.FC<FlagProps> = ({ celebrate = false }) => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const celebrateRef = useRef(celebrate);

//   useEffect(() => {
//     celebrateRef.current = celebrate;
//   }, [celebrate]);

//   useEffect(() => {
//     const mount = mountRef.current;
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     if (mount) {
//       mount.appendChild(renderer.domElement);
//     }

//     // Add lighting for better 3D effect
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
//     directionalLight.position.set(0, 1, 1);
//     scene.add(directionalLight);

//     // Create canvas for flag texture
//     const canvas = document.createElement('canvas');
//     canvas.width = 900;
//     canvas.height = 600;
//     const ctx = canvas.getContext('2d');
//     if (ctx) {
//       // White stripe
//       ctx.fillStyle = '#ffffff';
//       ctx.fillRect(0, 0, 225, 600);

//       // Green field
//       ctx.fillStyle = '#006600';
//       ctx.fillRect(225, 0, 675, 600);

//       // Crescent and star
//       const H = 600;
//       const W = 900;
//       const x_tr = W;
//       const y_tr = 0; // Top right
//       const x_bl = W / 4;
//       const y_bl = H; // Bottom left
//       const delta_x = x_bl - x_tr;
//       const delta_y = y_bl - y_tr;
//       const l = Math.sqrt(delta_x ** 2 + delta_y ** 2);
//       const r1 = 0.3 * H;
//       const r2 = 0.275 * H;
//       const r_star = 0.1 * H;

//       // P2
//       const t = (0.65 * H) / l;
//       const p2_x = x_tr + t * delta_x;
//       const p2_y = y_tr + t * delta_y;

//       // P1
//       const p1_x = (x_bl + x_tr) / 2;
//       const p1_y = H / 2;

//       // Intersection points for crescent
//       const d = Math.sqrt((p2_x - p1_x) ** 2 + (p2_y - p1_y) ** 2);
//       const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
//       const h = Math.sqrt(r1 ** 2 - a ** 2);
//       const mid_x = p1_x + a * (p2_x - p1_x) / d;
//       const mid_y = p1_y + a * (p2_y - p1_y) / d;
//       let perp_x = - (p2_y - p1_y) / d;
//       let perp_y = (p2_x - p1_x) / d;
//       // Flip to correct the direction of the crescent
//       perp_x = -perp_x;
//       perp_y = -perp_y;
//       let int1_x = mid_x + h * perp_x;
//       let int1_y = mid_y + h * perp_y;
//       let int2_x = mid_x - h * perp_x;
//       let int2_y = mid_y - h * perp_y;

//       // Angle for C1
//       let angle1 = Math.atan2(int1_y - p1_y, int1_x - p1_x);
//       let angle2 = Math.atan2(int2_y - p1_y, int2_x - p1_x);

//       // Swap if necessary for ccw order
//       const cross = (int1_x - p1_x) * (int2_y - p1_y) - (int1_y - p1_y) * (int2_x - p1_x);
//       if (cross < 0) {
//         [int1_x, int2_x] = [int2_x, int1_x];
//         [int1_y, int2_y] = [int2_y, int1_y];
//         [angle1, angle2] = [angle2, angle1];
//       }

//       // Angle for C2
//       const angle1_c2 = Math.atan2(int1_y - p2_y, int1_x - p2_x);
//       const angle2_c2 = Math.atan2(int2_y - p2_y, int2_x - p2_x);

//       // Draw the crescent (lens)
//       ctx.fillStyle = '#ffffff';
//       ctx.beginPath();
//       ctx.moveTo(int1_x, int1_y);
//       ctx.arc(p1_x, p1_y, r1, angle1, angle2, false);
//       ctx.arc(p2_x, p2_y, r2, angle2_c2, angle1_c2, true);
//       ctx.closePath();
//       ctx.fill();

//       // Star
//       const t_p1 = 0.5;
//       const dt = r1 / l;
//       const t_p3 = t_p1 + dt;
//       const p3_x = x_tr + t_p3 * delta_x;
//       const p3_y = y_tr + t_p3 * delta_y;
//       const dt_star = r_star / l;
//       const t_center = t_p3 - dt_star;
//       const center_x = x_tr + t_center * delta_x;
//       const center_y = y_tr + t_center * delta_y;
//       const vec_x = p3_x - center_x;
//       const vec_y = p3_y - center_y;
//       const angle_base = Math.atan2(vec_y, vec_x);

//       ctx.beginPath();
//       for (let i = 0; i < 5; i++) {
//         const angle = angle_base + (i * 2 * Math.PI / 5) * 2;
//         const x = center_x + r_star * Math.cos(angle);
//         const y = center_y + r_star * Math.sin(angle);
//         if (i === 0) {
//           ctx.moveTo(x, y);
//         } else {
//           ctx.lineTo(x, y);
//         }
//       }
//       ctx.closePath();
//       ctx.fill();
//     }

//     // Pakistan Flag with texture
//     const flagWidth = window.innerWidth < 768 ? 3 : 4;
//     const flagHeight = flagWidth * (2 / 3); // 3:2 ratio
//     const flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight, 32, 32);
//     const texture = new THREE.CanvasTexture(canvas);
//     const flagMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
//     const flag = new THREE.Mesh(flagGeometry, flagMaterial);
//     scene.add(flag);

//     camera.position.z = window.innerWidth < 768 ? 4 : 5;

//     // Add more animations: Particle system for celebration confetti effect
//     const particlesCount = 1000; // Increased for more effects
//     const posArrayWhite = new Float32Array(particlesCount * 3);
//     const posArrayGreen = new Float32Array(particlesCount * 3);
//     const posArrayGold = new Float32Array(particlesCount * 3);
//     for (let i = 0; i < particlesCount * 3; i++) {
//       posArrayWhite[i] = (Math.random() - 0.5) * (flagWidth + 3);
//       posArrayGreen[i] = (Math.random() - 0.5) * (flagWidth + 3);
//       posArrayGold[i] = (Math.random() - 0.5) * (flagWidth + 3);
//     }
//     const particlesGeometryWhite = new THREE.BufferGeometry();
//     particlesGeometryWhite.setAttribute('position', new THREE.BufferAttribute(posArrayWhite, 3));
//     const particlesMaterialWhite = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, blending: THREE.AdditiveBlending });
//     const particlesWhite = new THREE.Points(particlesGeometryWhite, particlesMaterialWhite);
//     scene.add(particlesWhite);

//     const particlesGeometryGreen = new THREE.BufferGeometry();
//     particlesGeometryGreen.setAttribute('position', new THREE.BufferAttribute(posArrayGreen, 3));
//     const particlesMaterialGreen = new THREE.PointsMaterial({ size: 0.05, color: 0x006600, blending: THREE.AdditiveBlending });
//     const particlesGreen = new THREE.Points(particlesGeometryGreen, particlesMaterialGreen);
//     scene.add(particlesGreen);

//     const particlesGeometryGold = new THREE.BufferGeometry();
//     particlesGeometryGold.setAttribute('position', new THREE.BufferAttribute(posArrayGold, 3));
//     const particlesMaterialGold = new THREE.PointsMaterial({ size: 0.05, color: 0xFFD700, blending: THREE.AdditiveBlending });
//     const particlesGold = new THREE.Points(particlesGeometryGold, particlesMaterialGold);
//     scene.add(particlesGold);

//     // Waving animation with pro effects
//     const animate = () => {
//       requestAnimationFrame(animate);
//       const time = Date.now() * 0.001;
//       const isCelebrating = celebrateRef.current;
//       const waveAmplitude = isCelebrating ? 0.5 : 0.3;
//       const waveSpeed = isCelebrating ? 5 : 4;
//       const rotationSpeed = isCelebrating ? 0.008 : 0.004;
//       const particleSpeed = isCelebrating ? 0.015 : 0.007;
//       const pulseAmplitude = isCelebrating ? 0.07 : 0.03;
//       const positions = flagGeometry.attributes.position.array as Float32Array;
//       for (let i = 0; i < positions.length; i += 3) {
//         const x = positions[i];
//         const y = positions[i + 1];
//         const waveX = waveAmplitude * Math.sin(x * 2 + time * waveSpeed); // Enhanced wave
//         const waveY = 0.2 * Math.cos(y * 1.5 + time * 2.5);
//         positions[i + 2] = waveX + waveY;
//       }
//       flagGeometry.attributes.position.needsUpdate = true;
//       flag.rotation.y += rotationSpeed; // Adjustable rotation
//       flag.scale.set(1 + pulseAmplitude * Math.sin(time * 0.7), 1 + pulseAmplitude * Math.sin(time * 0.7), 1); // Subtle pulsing

//       // Additional animations for particles
//       particlesWhite.rotation.y += particleSpeed;
//       particlesGreen.rotation.y += particleSpeed;
//       particlesGold.rotation.y += particleSpeed;
//       particlesWhite.position.y = Math.sin(time * (isCelebrating ? 4 : 2)) * 0.3;
//       particlesGreen.position.y = Math.cos(time * (isCelebrating ? 4 : 2)) * 0.3;
//       particlesGold.position.y = Math.sin(time * (isCelebrating ? 3.5 : 1.7)) * 0.35;

//       // Camera subtle movement for dynamic view
//       camera.position.x = Math.sin(time * 0.4) * 0.7;
//       camera.lookAt(scene.position);

//       renderer.render(scene, camera);
//     };
//     animate();

//     // Handle window resize for responsiveness
//     const handleResize = () => {
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//       renderer.setSize(width, height);
//       const scale = width < 768 ? 0.75 : 1;
//       flag.scale.set(scale, scale, 1);
//       camera.position.z = width < 768 ? 4 : 5;
//     };
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (mount) {
//         mount.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
// };

// export default Flag;


import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FlagProps {
  celebrate?: boolean;
}

const Flag: React.FC<FlagProps> = ({ celebrate = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const celebrateRef = useRef(celebrate);

  useEffect(() => {
    celebrateRef.current = celebrate;
  }, [celebrate]);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    // Add lighting for better 3D effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add point light for celebration glow
    const pointLight = new THREE.PointLight(0xFFD700, 0.5, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // Create canvas for flag texture
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // White stripe
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 225, 600);

      // Green field
      ctx.fillStyle = '#006600';
      ctx.fillRect(225, 0, 675, 600);

      // Crescent and star
      const H = 600;
      const W = 900;
      const x_tr = W;
      const y_tr = 0; // Top right
      const x_bl = W / 4;
      const y_bl = H; // Bottom left
      const delta_x = x_bl - x_tr;
      const delta_y = y_bl - y_tr;
      const l = Math.sqrt(delta_x ** 2 + delta_y ** 2);
      const r1 = 0.3 * H;
      const r2 = 0.275 * H;
      const r_star = 0.1 * H;

      // P2
      const t = (0.65 * H) / l;
      const p2_x = x_tr + t * delta_x;
      const p2_y = y_tr + t * delta_y;

      // P1
      const p1_x = (x_bl + x_tr) / 2;
      const p1_y = H / 2;

      // Intersection points for crescent
      const d = Math.sqrt((p2_x - p1_x) ** 2 + (p2_y - p1_y) ** 2);
      const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
      const h = Math.sqrt(r1 ** 2 - a ** 2);
      const mid_x = p1_x + a * (p2_x - p1_x) / d;
      const mid_y = p1_y + a * (p2_y - p1_y) / d;
      let perp_x = - (p2_y - p1_y) / d;
      let perp_y = (p2_x - p1_x) / d;
      // Flip to correct the direction of the crescent
      perp_x = -perp_x;
      perp_y = -perp_y;
      let int1_x = mid_x + h * perp_x;
      let int1_y = mid_y + h * perp_y;
      let int2_x = mid_x - h * perp_x;
      let int2_y = mid_y - h * perp_y;

      // Angle for C1
      let angle1 = Math.atan2(int1_y - p1_y, int1_x - p1_x);
      let angle2 = Math.atan2(int2_y - p1_y, int2_x - p1_x);

      // Swap if necessary for ccw order
      const cross = (int1_x - p1_x) * (int2_y - p1_y) - (int1_y - p1_y) * (int2_x - p1_x);
      if (cross < 0) {
        [int1_x, int2_x] = [int2_x, int1_x];
        [int1_y, int2_y] = [int2_y, int1_y];
        [angle1, angle2] = [angle2, angle1];
      }

      // Angle for C2
      const angle1_c2 = Math.atan2(int1_y - p2_y, int1_x - p2_x);
      const angle2_c2 = Math.atan2(int2_y - p2_y, int2_x - p2_x);

      // Draw the crescent (lens)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(int1_x, int1_y);
      ctx.arc(p1_x, p1_y, r1, angle1, angle2, false);
      ctx.arc(p2_x, p2_y, r2, angle2_c2, angle1_c2, true);
      ctx.closePath();
      ctx.fill();

      // Star
      const t_p1 = 0.5;
      const dt = r1 / l;
      const t_p3 = t_p1 + dt;
      const p3_x = x_tr + t_p3 * delta_x;
      const p3_y = y_tr + t_p3 * delta_y;
      const dt_star = r_star / l;
      const t_center = t_p3 - dt_star;
      const center_x = x_tr + t_center * delta_x;
      const center_y = y_tr + t_center * delta_y;
      const vec_x = p3_x - center_x;
      const vec_y = p3_y - center_y;
      const angle_base = Math.atan2(vec_y, vec_x);

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = angle_base + (i * 2 * Math.PI / 5) * 2;
        const x = center_x + r_star * Math.cos(angle);
        const y = center_y + r_star * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    }

    // Pakistan Flag with texture
    const flagWidth = window.innerWidth < 768 ? 3 : 4;
    const flagHeight = flagWidth * (2 / 3); // 3:2 ratio
    const flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);
    const flagMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.receiveShadow = true;
    flag.castShadow = true;
    scene.add(flag);

    camera.position.z = window.innerWidth < 768 ? 4 : 5;

    // Add more animations: Particle system for celebration confetti effect
    const particlesCount = 1200;
    const posArrayWhite = new Float32Array(particlesCount * 3);
    const posArrayGreen = new Float32Array(particlesCount * 3);
    const posArrayGold = new Float32Array(particlesCount * 3);
    const sizesWhite = new Float32Array(particlesCount);
    const sizesGreen = new Float32Array(particlesCount);
    const sizesGold = new Float32Array(particlesCount);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArrayWhite[i] = (Math.random() - 0.5) * (flagWidth + 3);
      posArrayGreen[i] = (Math.random() - 0.5) * (flagWidth + 3);
      posArrayGold[i] = (Math.random() - 0.5) * (flagWidth + 3);
    }
    for (let i = 0; i < particlesCount; i++) {
      sizesWhite[i] = Math.random() * 0.05 + 0.02;
      sizesGreen[i] = Math.random() * 0.05 + 0.02;
      sizesGold[i] = Math.random() * 0.05 + 0.02;
    }
    const particlesGeometryWhite = new THREE.BufferGeometry();
    particlesGeometryWhite.setAttribute('position', new THREE.BufferAttribute(posArrayWhite, 3));
    particlesGeometryWhite.setAttribute('size', new THREE.BufferAttribute(sizesWhite, 1));
    const particlesMaterialWhite = new THREE.PointsMaterial({ size: 0.05, sizeAttenuation: true, color: 0xffffff, blending: THREE.AdditiveBlending });
    const particlesWhite = new THREE.Points(particlesGeometryWhite, particlesMaterialWhite);
    scene.add(particlesWhite);

    const particlesGeometryGreen = new THREE.BufferGeometry();
    particlesGeometryGreen.setAttribute('position', new THREE.BufferAttribute(posArrayGreen, 3));
    particlesGeometryGreen.setAttribute('size', new THREE.BufferAttribute(sizesGreen, 1));
    const particlesMaterialGreen = new THREE.PointsMaterial({ size: 0.05, sizeAttenuation: true, color: 0x006600, blending: THREE.AdditiveBlending });
    const particlesGreen = new THREE.Points(particlesGeometryGreen, particlesMaterialGreen);
    scene.add(particlesGreen);

    const particlesGeometryGold = new THREE.BufferGeometry();
    particlesGeometryGold.setAttribute('position', new THREE.BufferAttribute(posArrayGold, 3));
    particlesGeometryGold.setAttribute('size', new THREE.BufferAttribute(sizesGold, 1));
    const particlesMaterialGold = new THREE.PointsMaterial({ size: 0.05, sizeAttenuation: true, color: 0xFFD700, blending: THREE.AdditiveBlending });
    const particlesGold = new THREE.Points(particlesGeometryGold, particlesMaterialGold);
    scene.add(particlesGold);

    // Waving animation with pro effects
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      const isCelebrating = celebrateRef.current;
      const waveAmplitude = isCelebrating ? 0.6 : 0.3;
      const waveSpeed = isCelebrating ? 6 : 4;
      const rotationSpeed = isCelebrating ? 0.01 : 0.005;
      const particleSpeed = isCelebrating ? 0.02 : 0.01;
      const pulseAmplitude = isCelebrating ? 0.1 : 0.05;
      const positions = flagGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const waveX = waveAmplitude * Math.sin(x * 2 + time * waveSpeed);
        const waveY = 0.2 * Math.cos(y * 1.5 + time * 3);
        positions[i + 2] = waveX + waveY;
      }
      flagGeometry.attributes.position.needsUpdate = true;
      flag.rotation.y += rotationSpeed;
      flag.scale.set(1 + pulseAmplitude * Math.sin(time * 0.8), 1 + pulseAmplitude * Math.sin(time * 0.8), 1);

      // Particle animations
      particlesWhite.rotation.y += particleSpeed;
      particlesGreen.rotation.y += particleSpeed;
      particlesGold.rotation.y += particleSpeed;
      particlesWhite.position.y = Math.sin(time * (isCelebrating ? 5 : 2)) * 0.4;
      particlesGreen.position.y = Math.cos(time * (isCelebrating ? 5 : 2)) * 0.4;
      particlesGold.position.y = Math.sin(time * (isCelebrating ? 4 : 1.5)) * 0.5;

      // Camera subtle movement
      camera.position.x = Math.sin(time * 0.5) * 0.8;
      camera.lookAt(scene.position);

      // Glow effect during celebration
      pointLight.intensity = isCelebrating ? 1.0 : 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize for responsiveness
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      const scale = width < 768 ? 0.75 : 1;
      flag.scale.set(scale, scale, 1);
      camera.position.z = width < 768 ? 4 : 5;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default Flag;