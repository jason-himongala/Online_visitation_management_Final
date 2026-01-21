import { useMemo, useState } from "react";
import { Card, Modal, Button } from "antd";
import { apiUrl } from "../../../../providers/appConfig";

export default function ListOfficeCard() {
    const departments = [
        { name: "GS", logo: "GS-1.webp", description: "Graduate School" },
        { name: "CoFES", logo: "CoFES-2.webp", description: "" },
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
        },
        {
            name: "CCIS",
            logo: "CCIS-2.webp",
            description: `YOUR BEST OPTION TO SUCCESS
                            The College of Computing and Information Sciences (CCIS) shapes future tech leaders by blending innovation, skills, and purpose where ideas turn into solutions for the digital world.`,
        },
        {
            name: "CED",
            logo: "CEd-2.webp",
            description: `ONE CED, ONE GOAL
                        The College of Education (CED) shapes future educators who inspire, lead, and transform lives.`,
        },
        {
            name: "CEGS",
            logo: "CEGS-2.webp",
            description: `NURTURING FUTURE ENGINEERS
                            The College of Engineering and Geosciences (CEGS) shapes future engineers and
                            geoscientists with the skills, knowledge, and innovation to solve real-world
                            challenges and drive sustainable progress.`,
        },
        {
            name: "CHASS",
            logo: "CHaSS-2.webp",
            description: `CHaSSing your dreams, ChaSSing your future.
                        The College of Humanities and Social Sciences aims to produce students who are better 
                        citizens in a multicultural world through their knowledge of cultural differences and 
                        of the history of fundamental cultural changes, imbued with good moral and ethical values.`,
        },
    ];

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);

    const scrollingList = useMemo(() => {
        const doubled = [...departments, ...departments];
        return doubled;
    }, []);

    const openModal = (dept) => {
        setSelectedDept(dept);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedDept(null);
    };

    const trackAnimationStyle = modalOpen
        ? { animationPlayState: "paused", WebkitAnimationPlayState: "paused" }
        : {
              animationPlayState: "running",
              WebkitAnimationPlayState: "running",
          };

    return (
        <div style={{ overflow: "hidden", width: "100%" }}>
            <div className="scroll-track" style={trackAnimationStyle}>
                {scrollingList.map((item, idx) => (
                    <div
                        key={idx}
                        className="scroll-item scroll-item-1"
                        style={{ position: "relative", ...trackAnimationStyle }}
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
                            <div>
                                <img
                                    src={apiUrl(`images/${item.logo}`)}
                                    style={{
                                        height: "180px",
                                        objectFit: "contain",
                                        maxWidth: "200px",
                                        margin: "0 auto",
                                        display: "block",
                                    }}
                                    alt={item.name}
                                />
                            </div>
                        </Card>

                        {hoveredIndex === idx && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    background: "rgba(0,0,0,0.65)",
                                    color: "#fff",
                                    padding: 12,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 14,
                                        textAlign: "center",
                                    }}
                                >
                                    {item.name}
                                </div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {item.description || ""}
                                </div>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => openModal(item)}
                                    style={{
                                        padding: 0,
                                        alignSelf: "center",
                                        color: "#91d5ff",
                                    }}
                                >
                                    See more
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Modal
                centered
                open={modalOpen}
                onCancel={closeModal}
                footer={[
                    <Button type="round" onClick={closeModal}>
                        Close
                    </Button>,
                ]}
                maskStyle={{
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                }}
                bodyStyle={{
                    textAlign: "center",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    {selectedDept?.description || ""}
                </div>
            </Modal>
        </div>
    );
}
