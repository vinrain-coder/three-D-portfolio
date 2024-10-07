import { memo } from "react";
import { Tilt } from "react-tilt";
import { motion, useReducedMotion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = memo(({ index, title, icon }) => {
  const prefersReducedMotion = useReducedMotion(); // Detect if the user prefers reduced motion

  return (
    <Tilt
      options={{ max: 25, speed: 400, scale: 1, transition: true }} // Optimized Tilt settings
      className="xs:w-full w-[250px]"
    >
      <motion.div
        variants={!prefersReducedMotion ? fadeIn("right", "spring", index * 0.5, 0.75) : {}} // Skip animation if reduced motion is preferred
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
          <img
            src={icon}
            alt={title} // Use dynamic alt tag
            className="w-16 h-16 object-contain lazyload" // Lazy load images for better performance
          />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  );
});

const About = () => {
  const prefersReducedMotion = useReducedMotion(); // Detect reduced motion preference

  return (
    <>
      <motion.div variants={!prefersReducedMotion ? textVariant() : {}}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={!prefersReducedMotion ? fadeIn("", "", 0.1, 1) : {}} // Disable animation if reduced motion is preferred
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I&apos;m a skilled website developer with experience in TypeScript and
        JavaScript, and expertise in frameworks like React, Node.js, Next.js, and
        Three.js. I&apos;m a quick learner and collaborate closely with clients to
        create efficient, scalable, and user-friendly solutions that solve
        real-world problems. Let&apos;s work together to bring your ideas into reality.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");


