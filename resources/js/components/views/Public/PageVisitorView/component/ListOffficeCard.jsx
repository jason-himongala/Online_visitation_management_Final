import { useMemo, useState } from "react";
import { Card, Modal, Button } from "antd";
import { apiUrl } from "../../../../providers/appConfig";

export default function ListOffficeCard() {
    const departments = [
        {
            name: "GS",
            logo: "GS-1.webp",
            description: "Graduate School",
            link: `https://www.carsu.edu.ph/ovpaa/graduate-school/`,
        },
        {
            name: "CoFES",
            logo: "CoFES-2.webp",
            description: `The College of Forestry and Environmental Science (CoFES) is committed to developing competent and socially responsible professionals in forestry and environmental science.`,
            link: "https://www.carsu.edu.ph/ovpaa/college-of-forestry-and-environmental-science/",
        },
        {
            name: "CMNS",
            logo: "CMNS-2.webp",
            description: `CALCULATING MINDS, NAVIGATING FUTURES
                        The College of Mathematics and Natural Sciences (CMNS) aims to provide high-quality 
                        education that fosters critical thinking, research skills, global and local 
                        collaborations, and the development of ethical, responsible citizens who contribute 
                        to the economic and sustainable growth of the Caraga Region and beyond.`,
        },
        {
            name: "CAA",
            logo: "CAA-black.webp",
            description: `WHERE GOOD THINGS GROW
                            The College of Agriculture and Agri-Industries (CAA) equips students with technical 
                            knowledge and hands-on skills in crop and livestock production and sustainable 
                            agricultural practices.`,
            link: `https://www.carsu.edu.ph/ovpaa/college-of-agriculture-and-agri-industries/`,
        },
        {
            name: "CCIS",
            logo: "CCIS-2.webp",
            description: `YOUR BEST OPTION TO SUCCESS
                            The College of Computing and Information Sciences (CCIS) shapes future tech leaders by blending innovation, skills, and purpose where ideas turn into solutions for the digital world.`,
            link: `https://www.carsu.edu.ph/ovpaa/college-of-computing-and-information-sciences/`,
        },
        {
            name: "CED",
            logo: "CEd-2.webp",
            description: `ONE CED, ONE GOAL
                        The College of Education (CED) shapes future educators who inspire, lead, and transform lives.`,
            link: `https://www.carsu.edu.ph/ovpaa/college-of-education/`,
        },
        {
            name: "CEGS",
            logo: "CEGS-2.webp",
            description: `NURTURING FUTURE ENGINEERS
                            The College of Engineering and Geosciences (CEGS) shapes future engineers and
                            geoscientists with the skills, knowledge, and innovation to solve real-world
                            challenges and drive sustainable progress.`,
            link: `https://www.carsu.edu.ph/ovpaa/college-of-engineering-and-geosciences/`,
        },
        {
            name: "CHASS",
            logo: "CHaSS-2.webp",
            description: `CHaSSing your dreams, ChaSSing your future.
                        The College of Humanities and Social Sciences aims to produce students who are better 
                        citizens in a multicultural world through their knowledge of cultural differences and 
                        of the history of fundamental cultural changes, imbued with good moral and ethical values.`,
            link: `https://www.carsu.edu.ph/ovpaa/college-of-humanities-and-social-sciences/`,
        },
    ];

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);

    const scrollingList = useMemo(() => {
        return [...departments, ...departments];
    }, []);

    const openModal = (dept) => {
        setSelectedDept(dept);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedDept(null);
    };

    const handleImageClick = (item) => {
        if (item.link) {
            window.open(item.link, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div style={{ overflow: "hidden", width: "100%" }}>
            <div className="scroll-track">
                {scrollingList.map((item, idx) => (
                    <div
                        key={idx}
                        className="scroll-item scroll-item-1"
                        style={{ position: "relative" }}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <Card
                            bordered={false}
                            style={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                width: 250,
                                margin: "0 10px",
                            }}
                        >
                            <div
                                onClick={() => handleImageClick(item)}
                                style={{
                                    cursor: item.link ? "pointer" : "default",
                                }}
                            >
                                <img
                                    src={apiUrl(`images/${item.logo}`)}
                                    style={{
                                        height: "180px",
                                        objectFit: "contain",
                                        maxWidth: "200px",
                                        margin: "0 auto",
                                        display: "block",
                                        transition: "filter 200ms ease",
                                        filter:
                                            hoveredIndex === idx
                                                ? "blur(2px) brightness(0.95)"
                                                : "none",
                                    }}
                                    alt={item.name}
                                />
                            </div>
                        </Card>

                        {/* Always-visible helpful note overlay */}
                        <div
                            style={{
                                position: "absolute",
                                left: 10,
                                right: 10,
                                bottom: 8,
                                background: "rgba(13, 91, 16, 0.6)",
                                color: "#fff",
                                padding: "6px 10px",
                                fontSize: 12,
                                borderRadius: 12,
                                textAlign: "center",
                                lineHeight: 1.3,
                                backdropFilter: "blur(6px)",
                                WebkitBackdropFilter: "blur(6px)",
                                pointerEvents: "none", // keep image clicks working
                            }}
                        >
                            You may click these offices for other information
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                centered
                open={modalOpen}
                onCancel={closeModal}
                footer={[
                    <Button key="close" onClick={closeModal}>
                        Close
                    </Button>,
                    selectedDept?.link && (
                        <Button
                            key="link"
                            href={selectedDept.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Page
                        </Button>
                    ),
                ]}
                maskStyle={{
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                }}
                bodyStyle={{ textAlign: "center" }}
            >
                <div style={{ textAlign: "center", whiteSpace: "pre-line" }}>
                    {selectedDept?.description || ""}
                </div>
            </Modal>
        </div>
    );
}
