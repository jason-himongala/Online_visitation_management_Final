import { useMemo } from "react";
import { Card } from "antd";
import { apiUrl } from "../../../../providers/appConfig";

export default function ListOfficeCard() {
    const departments = [
        { name: "GS", logo: "GS-1.webp" },
        { name: "CoFES", logo: "CoFES-2.webp" },
        { name: "CMNS", logo: "CMNS-2.webp" },
        { name: "CAA", logo: "CAA-black.webp" },
        { name: "CCIS", logo: "CCIS-2.webp" },
        { name: "CED", logo: "CEd-2.webp" },
        { name: "CEGS", logo: "CEGS-2.webp" },
        { name: "CHASS", logo: "CHaSS-2.webp" },
    ];

    const scrollingList = useMemo(() => {
        const doubled = [...departments, ...departments];
        return doubled;
    }, []);

    return (
        <div
            style={{ overflow: "hidden", width: "100%", background: "#f5f5f5" }}
        >
            <div className="scroll-track">
                {scrollingList.map((item, idx) => (
                    <div key={idx} className="scroll-item scroll-item-1">
                        <Card
                            variant="borderless"
                            style={{
                                backgroundColor: "#0d5b10",
                                width: 250,
                                margin: "0 10px",
                            }}
                        >
                            <div style={{ marginBottom: 12 }}>
                                <img
                                    src={apiUrl(`images/${item.logo}`)}
                                    style={{
                                        height: 80,
                                        objectFit: "contain",
                                        maxWidth: 200,
                                        margin: "0 auto",
                                        display: "block",
                                    }}
                                    alt={item.name}
                                />
                            </div>
                        </Card>
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "black",
                                textAlign: "center",
                                marginTop: 8,
                            }}
                        >
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
