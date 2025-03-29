"use client"

import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()

  // This would typically come from a database or API
  const projectsData = {
    gaia: {
      title: "Gaia",
      category: "design",
      description:
        "Starbucks aimed to transform data analytics into practical, experiential contexts through spatial computing, enhancing store operations, design, and training using AR/VR technology. As the Lead UX/UI Designer and Unity3D Developer, I was tasked with crafting user-friendly interfaces for advanced spatial computing systems and developing AR/VR applications integrated into Starbucks' environment.",
      image: "/projects/gaia/main-image.png",
      technologies: ["UX Design", "AR/VR", "Unity3D", "Spatial Computing"],
      github: "https://github.com/mikechaves",
      demo: "https://mikechaves.vercel.app",
      gallery: ["/projects/gaia/how-might-we.png", "/projects/gaia/wireframes-3d.png", "/projects/gaia/vr-testing.png"],
      details: {
        client: "Starbucks Corporation",
        date: "Dec 30, 2022",
        category: "Design Engineering",
        services: ["Experience Design", "XR Development", "Interactive Media"],
        actions: [
          {
            title: "User Research",
            description:
              "Conducted research to understand the needs of Starbucks employees and customers in a spatial computing context.",
          },
          {
            title: "Design",
            description:
              "Designed wireframes and prototypes using Figma, focusing on intuitive and accessible interfaces.",
          },
          {
            title: "Development",
            description:
              "Developed AR/VR applications using Unity3D, ensuring seamless integration with Starbucks' systems.",
          },
          {
            title: "Testing",
            description: "Conducted usability testing with employees and customers to refine the applications.",
          },
          {
            title: "Collaboration",
            description: "Worked with cross-functional teams to align digital solutions with operational needs.",
          },
        ],
        result:
          "The Gaia project successfully enhanced operational efficiency and customer experience, setting new benchmarks in retail technology. My contributions in design and development created a more engaging, intuitive, and immersive retail environment, advancing Starbucks' vision for a digitally integrated future.",
      },
    },
    "apt-plus": {
      title: "APT+",
      category: "design",
      description:
        "Ford APT+ is an end-to-end solution focused on streamlining manufacturing workflows by improving the accuracy and efficiency of time studies. These studies, previously slow and error-prone, cost Ford millions of dollars annually in wasted effort. My goal with APT+ was to design and implement a precision-driven, scalable system that eliminated inefficiencies and enabled data-driven decision-making—ultimately saving Ford approximately $1M per plant each year.",
      image: "/projects/apt-plus/main-image.png",
      technologies: ["UX/UI Design", "Data Visualization", "Process Optimization"],
      github: "https://github.com/mikechaves",
      demo: "https://mikechaves.vercel.app",
      gallery: ["/projects/apt-plus/situation.png", "/projects/apt-plus/action.png", "/projects/apt-plus/result.png"],
      details: {
        client: "Ford Motor Company",
        date: "Nov 22, 2021",
        category: "Design Engineering",
        services: ["Experience Design", "Unity Development", "Product in Production"],
        situation: [
          {
            title: "Overview",
            description:
              "Ford's manufacturing processes heavily rely on time studies to identify bottlenecks and optimize production lines. However, existing approaches were:",
          },
          {
            title: "Labor-Intensive",
            description: "Manual tracking led to frequent errors.",
          },
          {
            title: "Slow and Costly",
            description: "Collecting and interpreting data took too long, directly impacting production efficiency.",
          },
          {
            title: "Data Silos",
            description: "Lack of integrated systems made it difficult to draw insights from collected information.",
          },
        ],
        task: [
          {
            title: "Overview",
            description:
              "The objective was clear: build an intelligent, user-centric platform to conduct time studies more efficiently and accurately. Key goals included:",
          },
          {
            title: "Reduce Manual Errors",
            description: "through automated data collection and analysis.",
          },
          {
            title: "Enhance Data Transparency",
            description: "by centralizing results in a scalable system.",
          },
          {
            title: "Enable Data-Driven Decision-Making",
            description: "so stakeholders could act on real-time insights.",
          },
        ],
        actions: [
          {
            title: "Overview",
            description:
              "I led the design and engineering strategy, collaborating with project managers, software engineers, and researchers to:",
          },
          {
            title: "Identify Bottlenecks",
            description:
              "Conducted field research to pinpoint the most time-consuming or error-prone tasks in existing processes.",
          },
          {
            title: "Rapid Prototyping & Iteration",
            description:
              "Created proof-of-concept solutions in close coordination with stakeholders, then refined these prototypes based on real-world feedback.",
          },
          {
            title: "Automation & Accuracy",
            description:
              "Integrated data capture tools and algorithms to reduce human error, streamline data entry, and highlight critical insights for faster decision-making.",
          },
          {
            title: "Cross-Functional Alignment",
            description:
              "Worked with engineering, design, and business units to ensure the final solution met broader operational goals, including cost reduction and user adoption.",
          },
        ],
        results: [
          {
            title: "Saved Approximately $1M/Year per Plant",
            description:
              "By reducing manual errors and expediting time studies, each facility saw significant cost savings.",
          },
          {
            title: "Increased Efficiency & Accuracy",
            description:
              "Automated workflows cut the overall time spent on data collection and validation, boosting productivity on the assembly line.",
          },
          {
            title: "Provided Scalable Insights",
            description:
              "A centralized data platform allowed decision-makers to track performance metrics in real time and roll out process improvements across multiple plants.",
          },
        ],
      },
    },
    transcribe: {
      title: "Transcribe",
      category: "design",
      description:
        "Starbucks sought to improve communication in their stores, particularly in drive-through scenarios, by implementing real-time speech-to-text transcription. This initiative aimed to enhance inclusivity and operational efficiency. As the Product UX/UI Designer and React Developer, I designed and developed the Transcribe application to address unique communication challenges in high-traffic retail environments.",
      image: "/projects/transcribe/main-image.png",
      technologies: ["React.js", "UX/UI Design", "Speech-to-Text API", "Accessibility"],
      github: "https://github.com/mikechaves",
      demo: "https://mikechaves.vercel.app",
      gallery: [
        "/projects/transcribe/situation.png",
        "/projects/transcribe/action.png",
        "/projects/transcribe/testing.png",
        "/projects/transcribe/result.png",
      ],
      details: {
        client: "Starbucks Corporation",
        date: "Dec 15, 2022",
        category: "Design Engineering",
        services: ["Experience Design", "Accessibility Solutions", "Emerging Technologies"],
        situation:
          "Starbucks sought to improve communication in their stores, particularly in drive-through scenarios, by implementing real-time speech-to-text transcription. This initiative aimed to enhance inclusivity and operational efficiency.",
        task: "As the Product UX/UI Designer and React Developer, my responsibility was to design and develop the Transcribe application. The goal was to address unique communication challenges in high-traffic retail environments and ensure the tool was effective and user-friendly.",
        actions: [
          {
            title: "User Research",
            description:
              "Conducted user research to understand the needs of Starbucks employees and customers, especially focusing on individuals with disabilities.",
          },
          {
            title: "Design",
            description:
              "Created wireframes and prototypes using Figma, ensuring the interface was intuitive and accessible.",
          },
          {
            title: "Development",
            description:
              "Developed the application using React.js and integrated it with Google Cloud's Speech-to-Text API for real-time transcription.",
          },
          {
            title: "Testing",
            description:
              "Conducted rigorous testing, including usability testing with individuals with disabilities, to ensure the tool met diverse needs.",
          },
          {
            title: "Integration",
            description:
              "Integrated the application into Starbucks' existing operational framework, ensuring seamless deployment.",
          },
        ],
        result:
          "The Transcribe initiative significantly enhanced customer satisfaction and operational fluidity. It improved transcription accuracy by 30% and reduced manual note-taking time by 50%. This project showcased my expertise in UX/UI design and development and emphasized my commitment to creating accessible and inclusive digital solutions.",
      },
    },
    geovoice: {
      title: "GeoVoice",
      category: "web",
      description:
        "GeoVoice is a platform created to streamline geospatial data analysis and stakeholder feedback, primarily for large-scale infrastructure and environmental planning projects. By integrating intuitive mapping tools with a centralized feedback system, GeoVoice enables teams to gather, visualize, and act on geographically specific insights in real time. The result is a more transparent and efficient way to collaborate, whether for urban development, energy planning, or environmental impact assessments.",
      image: "/projects/geovoice/main-image.png",
      technologies: ["Geospatial Mapping", "UX/UI Design", "Data Visualization", "Collaborative Tools"],
      github: "https://github.com/mikechaves",
      demo: "https://mikechaves.vercel.app",
      gallery: [
        "/projects/geovoice/situation.png",
        "/projects/geovoice/action.png",
        "/projects/geovoice/interface.png",
        "/projects/geovoice/result.png",
      ],
      details: {
        client: "POWER Engineers",
        date: "Jan 10, 2021",
        category: "Design Engineering",
        services: ["UX/UI Design", "Web Development", "Geospatial Solutions"],
        situation: [
          {
            title: "Overview",
            description:
              "Large-scale projects often involve multiple stakeholders—community members, government agencies, and private sector partners—who need to provide location-specific feedback. Existing processes (e.g., in-person forums, paper surveys) can be slow, fragmented, and prone to data loss.",
          },
          {
            title: "Challenge",
            description:
              "How might we simplify the process of collecting and analyzing spatially relevant feedback to make more informed decisions?",
          },
          {
            title: "Context",
            description:
              "Advances in geospatial technology offered new possibilities for data visualization, but most tools weren't user-friendly or collaborative enough for diverse, non-technical audiences.",
          },
        ],
        task: [
          {
            title: "Consolidates",
            description: "multiple map layers and real-time data inputs.",
          },
          {
            title: "Facilitates",
            description: "stakeholder engagement through an easy-to-use interface for comments and feedback.",
          },
          {
            title: "Empowers",
            description:
              "project teams to make quicker, more accurate decisions using interactive mapping and clear data visualization.",
          },
        ],
        actions: [
          {
            title: "Research & Alignment",
            description:
              "Conducted sessions with local planners, environmental experts, and community members to pinpoint their biggest pain points in collecting and sharing geographic feedback. Evaluated existing GIS tools and collaboration platforms, identifying gaps in usability and real-time interaction.",
          },
          {
            title: "Rapid Prototyping",
            description:
              "Created low-fidelity sketches and mid-fidelity prototypes focusing on map layouts, layered data displays, and straightforward feedback mechanisms. Iteratively tested prototypes with target audiences, refining the interface to reduce complexity and ensure clarity.",
          },
          {
            title: "Development & Integration",
            description:
              "Incorporated multiple map layers (e.g., demographics, zoning, environmental impact) to provide context for each feedback submission. Built a central dashboard where stakeholders could track updates, leave comments, and view geospatial analytics. Ensured the platform could handle large datasets and secure sensitive user information, particularly important for municipal or corporate clients.",
          },
        ],
        results: [
          {
            title: "Enhanced Collaboration",
            description:
              "A centralized environment allowed diverse stakeholders to contribute geospatial insights, reducing silos.",
          },
          {
            title: "Faster Feedback Loops",
            description:
              "Real-time data updates and straightforward comment submissions cut weeks off traditional planning cycles.",
          },
          {
            title: "Broader Applicability",
            description:
              "The modular design supported expansion across multiple regions and project types, from infrastructure upgrades to environmental monitoring.",
          },
        ],
      },
    },
    speakeasy: {
      title: "SpeakEasy",
      category: "research",
      description:
        "SpeakEasy is an immersive research and design project that reimagines Extended Reality (XR) for a more inclusive future. By integrating a voice-driven AI interface into XR environments, SpeakEasy addresses the complex interaction barriers faced by users with low muscle tone and other physical challenges. This project is dedicated to making XR more accessible, intuitive, and engaging.",
      image: "/projects/speakeasy/main-image.png",
      technologies: ["Voice-Driven AI", "XR Accessibility", "Inclusive Design"],
      github: "https://github.com/mikechaves",
      demo: "https://mikechaves.vercel.app",
      gallery: [
        "/projects/speakeasy/situation.png",
        "/projects/speakeasy/action.png",
        "/projects/speakeasy/result.png",
        "/projects/speakeasy/exhibition.png",
      ],
      details: {
        client: "Master of Design in Experience Design, SJSU",
        date: "Oct 14, 2024",
        category: "XR Projects",
        services: ["Experience Design", "XR Development", "Accessibility Solutions"],
        situation: [
          {
            title: "Overview",
            description:
              "Extended Reality holds transformative promise but often remains a domain accessible only to the tech-savvy. Current XR systems typically require precise physical inputs and complex navigation, thereby excluding users with disabilities and limited motor control.",
          },
          {
            title: "Challenge",
            description:
              "Users with low muscle tone struggle with conventional XR interfaces that depend on manual interaction and intricate gesture controls.",
          },
          {
            title: "Context",
            description:
              "Despite rapid advancements in XR hardware and software, many experiences lack the simplicity and naturalness required for universal accessibility.",
          },
        ],
        task: [
          {
            title: "Overview",
            description:
              "The core objective was to design an XR experience that minimizes physical strain while maximizing intuitive interaction. I set out to develop a voice-driven AI system—SpeakEasy—that would:",
          },
          {
            title: "Reduce physical interaction",
            description: "by shifting control to natural language commands.",
          },
          {
            title: "Personalize the user experience",
            description: "using adaptive AI to respond to individual needs.",
          },
          {
            title: "Facilitate inclusive design",
            description: "that benefits users across a wide spectrum of abilities.",
          },
        ],
        actions: [
          {
            title: "Research & Literature Review",
            description:
              "I conducted a comprehensive review of XR accessibility challenges, integrating insights from academic sources, industry trends, and competitive analyses.",
          },
          {
            title: "Co-Design Workshops",
            description:
              "Engaging with target users and experts, I organized iterative workshops that enabled real-time feedback and guided the evolution of the interface design.",
          },
          {
            title: "Prototype Development",
            description:
              "Beginning with early sketches and wireframes in ShapesXR, I rapidly moved through iterative cycles—transitioning to a Unity3D prototype—to incorporate voice recognition and multimodal feedback mechanisms.",
          },
          {
            title: "Feedback & Iteration",
            description:
              "Continuous testing, supported by participant recruitment and structured field protocols, allowed for refinements in interaction logic and overall system adaptability.",
          },
        ],
        results: [
          {
            title: "Overview",
            description: "The iterative process has yielded a promising framework that demonstrates:",
          },
          {
            title: "Enhanced Accessibility",
            description:
              "Early user tests indicate a marked reduction in physical interaction requirements, allowing individuals with low muscle tone to navigate XR environments more comfortably.",
          },
          {
            title: "Improved User Engagement",
            description:
              "Participants reported a more natural and engaging experience, with voice commands enabling quicker, more intuitive interactions compared to traditional input methods.",
          },
          {
            title: "A Scalable Framework",
            description:
              "The success of SpeakEasy's initial iterations lays the groundwork for broader applications in XR, supporting further research into complementary modalities like gesture recognition.",
          },
        ],
        exhibition: [
          {
            title: "Interactive Stations",
            description:
              "Live demonstrations of the prototype where visitors can experience the voice-driven interface firsthand.",
          },
          {
            title: "User Testimonials",
            description:
              "Video recordings and written feedback from participants will highlight the impact of the design on accessibility and usability.",
          },
          {
            title: "Future Concepts",
            description:
              "Insights into planned enhancements, including advanced gesture recognition and deeper personalization features.",
          },
        ],
      },
    },
    "sound-escape-vr": {
      title: "Sound Escape VR",
      category: "ar-vr",
      description:
        "Sound Escape VR is an immersive virtual reality music-making and exploration experience that channels a retro 80s synthwave aesthetic while blending real-time audio visualization and interactive world-building. Users can craft their own musical tracks on a grid-based sequencer and watch as the environment reacts and transforms in sync with every note.",
      image: "/placeholder.svg?height=600&width=1200",
      technologies: ["Unity3D", "C#", "VR Development", "Audio Visualization", "Interactive Music"],
      github: "https://github.com/mikechaves/sound-escape-vr",
      demo: "https://mikechaves.vercel.app",
      gallery: [],
      details: {
        client: "Personal Project",
        date: "March 2023",
        category: "XR Development",
        services: ["VR Development", "Audio Programming", "Interactive Design"],
        situation: [
          {
            title: "Overview",
            description:
              "Virtual reality offers unique opportunities for music creation and visualization, but many existing applications either focus solely on professional music production or provide only passive music visualization experiences. There was a gap in the market for accessible, intuitive music creation tools that leverage the immersive potential of VR.",
          },
          {
            title: "Challenge",
            description:
              "How might we create an engaging VR experience that allows users with varying levels of musical expertise to create and visualize music in an intuitive, embodied way?",
          },
          {
            title: "Context",
            description:
              "The rise of consumer VR headsets like Meta Quest 3 has created new opportunities for innovative music applications that go beyond traditional interfaces.",
          },
        ],
        task: [
          {
            title: "Overview",
            description:
              "The goal was to develop an immersive VR application that combines music creation with visual feedback in a cohesive, engaging experience. The project needed to:",
          },
          {
            title: "Simplify Music Creation",
            description: "by implementing an intuitive grid-based sequencer that doesn't require musical expertise.",
          },
          {
            title: "Enhance Immersion",
            description: "through real-time audio visualization that responds dynamically to user-created sounds.",
          },
          {
            title: "Optimize Performance",
            description: "to ensure smooth operation on standalone VR headsets like the Meta Quest 3.",
          },
        ],
        actions: [
          {
            title: "Technical Architecture",
            description:
              "Developed the application using Unity3D with C# as the primary programming language. Implemented custom shaders for responsive visual effects and optimized audio processing for real-time feedback.",
          },
          {
            title: "User Interface Design",
            description:
              "Created an intuitive spatial interface that leverages natural hand movements for music composition, allowing users to place notes on a three-dimensional grid sequencer.",
          },
          {
            title: "Audio-Visual Integration",
            description:
              "Programmed a system that translates musical parameters (pitch, volume, rhythm) into visual elements that transform the environment, creating a synesthetic experience.",
          },
          {
            title: "Performance Optimization",
            description:
              "Reworked the original Oculus implementation to ensure optimal performance on Meta Quest 3, focusing on maintaining high frame rates while preserving visual quality.",
          },
        ],
        results: [
          {
            title: "Overview",
            description:
              "Sound Escape VR successfully bridges the gap between music creation and visualization in virtual reality:",
          },
          {
            title: "Intuitive Music Creation",
            description:
              "Users can quickly learn to create musical patterns using the grid-based sequencer, regardless of their prior musical experience.",
          },
          {
            title: "Immersive Audio-Visual Experience",
            description:
              "The environment reacts and transforms in sync with user-created music, creating a deeply engaging experience that connects sound and visuals.",
          },
          {
            title: "Technical Achievement",
            description:
              "Successfully optimized for Meta Quest 3, demonstrating the ability to create complex, interactive experiences for standalone VR headsets.",
          },
        ],
      },
    },
    "material-explorer": {
      title: "Material Explorer",
      category: "web",
      description:
        "Material Explorer is an interactive web application that allows users to create, customize, and visualize 3D materials in real-time. Built with Three.js and React Three Fiber, this tool provides immediate visual feedback on material property changes such as color, metalness, and roughness, making it ideal for designers, developers, and 3D artists.",
      image: "/placeholder.svg?height=600&width=1200",
      technologies: ["TypeScript", "React", "Three.js", "React Three Fiber", "WebGL"],
      github: "https://github.com/mikechaves/material-explorer",
      demo: "https://mikechaves.vercel.app",
      gallery: [],
      details: {
        client: "Personal Project",
        date: "January 2023",
        category: "Web Development",
        services: ["3D Web Development", "UI/UX Design", "Interactive Tools"],
        situation: [
          {
            title: "Overview",
            description:
              "3D material creation and customization typically requires specialized knowledge and software, creating barriers for designers and developers who want to experiment with materials for their web-based 3D projects. Existing tools often lack real-time feedback or are too complex for quick iterations.",
          },
          {
            title: "Challenge",
            description:
              "How might we simplify the process of creating and customizing 3D materials for the web while providing immediate visual feedback in an intuitive interface?",
          },
          {
            title: "Context",
            description:
              "With the growing popularity of 3D on the web through libraries like Three.js and React Three Fiber, there's an increasing need for accessible tools that bridge the gap between technical implementation and visual design.",
          },
        ],
        task: [
          {
            title: "Overview",
            description:
              "The goal was to create a user-friendly web application that makes 3D material creation and customization accessible to both developers and designers. The application needed to:",
          },
          {
            title: "Simplify Material Creation",
            description:
              "by providing an intuitive interface for adjusting material properties without requiring deep technical knowledge.",
          },
          {
            title: "Provide Real-time Feedback",
            description: "through immediate visual updates as users modify material properties.",
          },
          {
            title: "Ensure Cross-device Compatibility",
            description: "by creating a responsive design that works well on various devices and screen sizes.",
          },
        ],
        actions: [
          {
            title: "Technical Implementation",
            description:
              "Developed the application using TypeScript, React, and Three.js with React Three Fiber for 3D rendering. Implemented a state management system to handle material property changes and updates.",
          },
          {
            title: "User Interface Design",
            description:
              "Created an intuitive UI with clear controls for adjusting material properties such as color, metalness, roughness, and more. Designed the layout to provide a large preview area alongside easily accessible controls.",
          },
          {
            title: "Performance Optimization",
            description:
              "Implemented efficient rendering techniques to ensure smooth performance, even when making rapid changes to material properties. Optimized the application for various devices and browsers.",
          },
          {
            title: "User Testing & Iteration",
            description:
              "Conducted user testing with both developers and designers to refine the interface and workflow. Iterated on the design based on feedback to improve usability and functionality.",
          },
        ],
        results: [
          {
            title: "Overview",
            description:
              "Material Explorer successfully bridges the gap between technical implementation and visual design for 3D materials on the web:",
          },
          {
            title: "Intuitive Material Customization",
            description:
              "Users can easily create and customize materials with immediate visual feedback, making the process more accessible and efficient.",
          },
          {
            title: "Responsive Design",
            description:
              "The application works seamlessly across various devices and screen sizes, ensuring a consistent experience for all users.",
          },
          {
            title: "Educational Value",
            description:
              "Beyond its practical utility, Material Explorer serves as an educational tool for understanding how different material properties affect the appearance of 3D objects.",
          },
        ],
      },
    },
    portals: {
      title: "Portals",
      category: "ar-vr",
      description:
        "An immersive AR experience for Snap Spectacles designed to bring music, culture, and climate awareness to life through interactive and accessible features. Utilizing spatial audio and computer vision, Portals allows users to engage with cultural and musical experiences in a unique way.",
      image: "/placeholder.svg?height=600&width=1200",
      technologies: ["AR", "Snap Spectacles", "Spatial Audio", "Voice UI", "Accessibility"],
      github: "https://github.com/mikechaves/stanford-immerse-the-bay-24",
      demo: "https://mikechaves.vercel.app",
      gallery: [],
      details: {
        client: "Stanford's Immerse the Bay 2024 XR Hackathon",
        date: "November 2023",
        category: "AR Development",
        services: ["AR Experience Design", "Accessibility Solutions", "Cultural Education"],
        situation: [
          {
            title: "Overview",
            description:
              "As AR technologies become more widespread, there's a growing need for experiences that prioritize accessibility, cultural education, and climate awareness. Many existing AR applications focus primarily on visual elements, often overlooking audio-based interactions and accessibility features.",
          },
          {
            title: "Challenge",
            description:
              "How might we create an immersive AR experience that makes diverse musical traditions accessible to everyone, including individuals with limited mobility, while promoting cultural education and climate awareness?",
          },
          {
            title: "Context",
            description:
              "Snap Spectacles provide a unique platform for AR development with spatial audio capabilities, offering new possibilities for creating inclusive and educational experiences.",
          },
        ],
        task: [
          {
            title: "Overview",
            description:
              "The goal was to develop an AR experience for Snap Spectacles that would achieve four main objectives:",
          },
          {
            title: "Accessibility",
            description:
              "Design inclusive, voice-controlled features and audio cues for individuals with limited hand mobility or speech difficulties.",
          },
          {
            title: "Cultural Education",
            description:
              "Enable auditory exploration of music from various cultures, focusing on historical context and lesser-known instruments.",
          },
          {
            title: "Joy",
            description: "Create fun, collaborative AR jam sessions with friends using spatial audio.",
          },
          {
            title: "Climate Change Awareness",
            description:
              "Highlight music that connects to natural environments or climate themes to increase awareness through audio immersion.",
          },
        ],
        actions: [
          {
            title: "Co-Creation Features",
            description:
              "Developed spatial audio circles that position friends and collaborators in a virtual jam session, each playing an instrument or adding to the ambiance, allowing friends to interact audibly to avoid visual clutter.",
          },
          {
            title: "Interactive Auditory Timeline",
            description:
              "Implemented cultural markers recognition using Spectacles' computer vision to identify cultural artifacts or historical sites and launch a timeline with music, stories, and significant figures from that culture.",
          },
          {
            title: "Accessibility Implementation",
            description:
              "Created voice command controls for the experience, providing accessibility for individuals with limited mobility, along with a custom 'safe word' exit feature to prioritize user comfort and safety.",
          },
          {
            title: "Educational Layers",
            description:
              "Integrated optional deep dives into the history and significance of various music elements for educational purposes.",
          },
        ],
        results: [
          {
            title: "Inclusive AR Experience",
            description:
              "Successfully created an AR experience that prioritizes accessibility through voice controls and audio-based interactions.",
          },
          {
            title: "Cultural Education Platform",
            description:
              "Developed a platform for exploring diverse musical traditions and their historical contexts, focusing on underrepresented communities.",
          },
          {
            title: "Collaborative Music Creation",
            description:
              "Implemented spatial audio features that enable users to create collaborative, immersive musical experiences with friends.",
          },
          {
            title: "Climate Awareness Integration",
            description:
              "Incorporated elements that highlight the connection between music, natural environments, and climate themes to raise awareness through immersive audio experiences.",
          },
        ],
      },
    },
    digitalhous: {
      title: "Digitalhous XR Applications",
      category: "development",
      description:
        "Founded Digitalhous, a tech-focused LLC, where I lead end-to-end development of innovative apps, software, games, and XR solutions powered by AI. Specializing in immersive VR/AR technologies and AI-driven features, I drive user-centered design with a focus on accessibility.",
      image: "/placeholder.svg?height=600&width=1200",
      technologies: ["XR", "AI", "Entrepreneurship"],
      github: "https://github.com/mikechaves",
      demo: "https://mikechaves.vercel.app",
    },
    "voice-first-ar": {
      title: "Voice-First AR Prototypes",
      category: "research",
      description:
        "Developing voice-first AR prototypes leveraging transformer-based speech models for accessibility. This research explores how voice interfaces can make augmented reality more accessible and intuitive for all users.",
      image: "/placeholder.svg?height=600&width=1200",
      technologies: ["AR", "Voice UI", "Accessibility"],
      github: "https://github.com/mikechaves",
      demo: "https://mikechaves.vercel.app",
    },
    "ai-energy-consumption": {
      title: "AI Energy Consumption",
      category: "web",
      description:
        "An interactive 3D data visualization showcasing the global impact of AI's energy consumption and CO2 emissions across different countries and regions. Built using A-Frame and D3.js, this project combines immersive 3D graphics with data storytelling to highlight the rising energy demands associated with AI technologies.",
      image: "/placeholder.svg?height=600&width=1200",
      technologies: ["A-Frame", "D3.js", "3D Visualization", "Data Storytelling", "JavaScript"],
      github: "https://github.com/mikechaves/ai-energy-consumption",
      demo: "https://mikechaves.github.io/ai-energy-consumption/",
      gallery: [],
      details: {
        client: "Personal Project",
        date: "March 2023",
        category: "Web Development",
        services: ["Data Visualization", "3D Web Development", "Environmental Impact Analysis"],
        situation: [
          {
            title: "Overview",
            description:
              "As AI technologies continue to advance and become more widespread, their energy consumption and environmental impact are growing concerns that often go unnoticed by the general public and even many technology professionals.",
          },
          {
            title: "Challenge",
            description:
              "Presenting complex environmental data in an engaging, accessible way is difficult. Traditional charts and graphs often fail to convey the scale and significance of the issue in a way that resonates with viewers.",
          },
          {
            title: "Context",
            description:
              "The rise of AI models with billions of parameters has led to exponential growth in computing requirements, with corresponding increases in energy consumption and carbon emissions.",
          },
        ],
        task: [
          {
            title: "Overview",
            description:
              "The goal was to create an interactive 3D visualization that makes abstract data about AI energy consumption tangible and impactful for users.",
          },
          {
            title: "Educational Objective",
            description:
              "Raise awareness about the environmental impact of AI technologies in an engaging, interactive format.",
          },
          {
            title: "Technical Objective",
            description:
              "Combine web-based 3D visualization with accurate data representation to create an immersive learning experience.",
          },
        ],
        actions: [
          {
            title: "Research & Data Collection",
            description:
              "Gathered and analyzed data on AI energy consumption across different countries and regions, focusing on both training and inference phases of AI systems.",
          },
          {
            title: "Technical Implementation",
            description:
              "Developed a web-based 3D visualization using A-Frame for the immersive environment and D3.js for data binding and manipulation. Created custom shaders and animations to represent energy consumption patterns.",
          },
          {
            title: "User Experience Design",
            description:
              "Designed an intuitive interface that allows users to explore the data from different perspectives, with interactive elements that reveal additional information and context.",
          },
        ],
        results: [
          {
            title: "Engaging Visualization",
            description:
              "Created a compelling 3D experience that transforms abstract data into a visually striking representation of AI's environmental impact.",
          },
          {
            title: "Educational Tool",
            description:
              "The project serves as both a data visualization and an educational resource, helping users understand the environmental implications of AI advancement.",
          },
          {
            title: "Technical Achievement",
            description:
              "Successfully integrated complex 3D graphics with data visualization techniques in a web-based application that performs well across different devices.",
          },
        ],
      },
    },
  }

  const project = projectsData[id as keyof typeof projectsData]

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">project_details.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-2">
            <span className="text-primary">$</span> cat {id}.json
          </p>
          <div className="mb-4">
            <p>
              <span className="text-primary">title:</span> {project.title}
            </p>
            <p>
              <span className="text-primary">category:</span> {project.category}
            </p>
            <p>
              <span className="text-primary">client:</span> {project.details.client}
            </p>
            <p>
              <span className="text-primary">date:</span> {project.details.date}
            </p>
            <p className="flex flex-wrap gap-2 mt-2">
              <span className="text-primary">stack:</span>
              {project.technologies.map((tech, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                  {tech}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-80 rounded-md overflow-hidden">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>

      {project.gallery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {project.gallery.map((img, index) => (
            <div
              key={index}
              className="bg-zinc-100 rounded-md overflow-hidden h-[200px] flex items-center justify-center"
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`${project.title} gallery image ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md transition-colors"
        >
          <Github size={16} /> View on GitHub
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
        >
          <ExternalLink size={16} /> Live Demo
        </a>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <p className="text-muted-foreground">{project.description || "No description available."}</p>
      </div>

      {project.details && project.details.situation && typeof project.details.situation === "string" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Situation</h2>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <p className="text-zinc-300">{project.details.situation}</p>
          </div>
        </div>
      )}

      {project.details && project.details.situation && Array.isArray(project.details.situation) && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Situation</h2>
          <div className="space-y-4">
            {project.details.situation.map((item, index) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">•</span> {item.title}
                </h3>
                <p className="text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.details && project.details.task && typeof project.details.task === "string" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Task</h2>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <p className="text-zinc-300">{project.details.task}</p>
          </div>
        </div>
      )}

      {project.details && project.details.task && Array.isArray(project.details.task) && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Task</h2>
          <div className="space-y-4">
            {project.details.task.map((item, index) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">•</span> {item.title}
                </h3>
                <p className="text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.details && project.details.actions && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Action</h2>
          <div className="space-y-4">
            {project.details.actions.map((action, index) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">{index + 1}.</span> {action.title}
                </h3>
                <p className="text-zinc-400">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.details && project.details.results && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Result</h2>
          <div className="space-y-4">
            {project.details.results.map((result, index) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">•</span> {result.title}
                </h3>
                <p className="text-zinc-400">{result.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.details && project.details.result && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Result</h2>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <p className="text-zinc-300">{project.details.result}</p>
          </div>
        </div>
      )}

      {project.details && project.details.exhibition && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Exhibition & Future Directions</h2>
          <div className="space-y-4">
            {project.details.exhibition.map((item, index) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">•</span> {item.title}
                </h3>
                <p className="text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

