import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#f5f5f5] px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-2xl font-bold text-black md:text-3xl">
          Features
        </h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-xl font-bold text-black">
              Real-time Collaboration
            </h3>
            <p className="text-base text-gray-700">
              Work seamlessly with your team in real-time. View active users in
              the editor, with upcoming features such as cursor tracking and
              selection sharing for an enhanced collaborative experience.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full rounded-lg object-cover"
            >
              <source src="/assets/clips/collab.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-24 grid grid-cols-1 items-center gap-8 md:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full rounded-lg object-cover"
            >
              <source
                src="/assets/clips/floatingactionbar.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="order-1 space-y-4 md:order-2"
          >
            <h3 className="text-xl font-bold text-black">
              Floating Action Bar
            </h3>
            <p className="text-base text-gray-700">
              Enhance your coding experience with a floating action bar that
              provides quick access to essential tools like fullscreen mode,
              copy functionality, file favoriting, and more.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-24 grid grid-cols-1 items-center gap-8 md:grid-cols-2"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-xl font-bold text-black">Quick Search</h3>
            <p className="text-base text-gray-700">
              Find files instantly with an intelligent search feature that
              allows you to filter through your codebase efficiently, including
              a dedicated section for your favorite files.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="feature-image relative h-[280px] overflow-hidden rounded-xl"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full rounded-lg object-cover"
            >
              <source src="/assets/clips/search.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 items-center gap-8 md:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full rounded-lg object-cover"
            >
              <source src="/assets/clips/share.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="order-1 space-y-4 md:order-2"
          >
            <h3 className="text-xl font-bold text-black">Instant Sharing</h3>
            <p className="text-base text-gray-700">
              Share your code effortlessly with a single click. Use the
              View-only mode: &quot;view-only&quot; option to allow others to
              see your work without making changes, ensuring full control over
              your code.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
