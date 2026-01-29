import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "@/Context/AuthContext";
import axios from "axios";
import { BarLoader } from "react-spinners";
import logo from "../assets/gameloader.png";




const PlayGame = () => {
  const { id } = useParams(); // এটা gameID
  const { user, balance } = useContext(AuthContext);

  const [gameUrl, setGameUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loaderEnabled, setLoaderEnabled] = useState(false);

  useEffect(() => {
    const launchGame = async () => {
      let splashPromise = null;
      try {
        // Wait for user context to be available; don't alert on initial mount
        if (!user) {
          return;
        }
        // Fetch loader toggle from backend
        let flag = false;
        try {
          const cfg = await axios.get(`${import.meta.env.VITE_BACKEND_API}loader`);
          flag = !!cfg?.data?.loader;
          setLoaderEnabled(flag);
        } catch {
          flag = false;
          setLoaderEnabled(false);
        }
        // If loader enabled, start a 3-second minimum splash timer in parallel
        if (flag) {
          splashPromise = new Promise((resolve) => setTimeout(resolve, 3000));
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}playgame`,
          {
            gameID: id,
            username: user.username,
            money: balance || 0,
          }
        );

        console.log(response);

        const url = response.data.gameUrl;

        if (url) {
          setGameUrl(url);
        } else {
          setErrorMsg("Failed to load game. Please contact support team.");
        }
      } catch (error) {
        console.error("Game launch failed:", error);
        setErrorMsg("Failed to load game. Please contact support team.");
      } finally {
        // Finish loading after splash timer (if any) and request complete
        try {
          if (typeof splashPromise?.then === "function") {
            await splashPromise;
          }
        } finally {
          setLoading(false);
        }
      }
    };

    launchGame();
  }, [id, user, balance]);

  // Loading Screen
  if (loading) {
    const logoElement = (
      <img
        src={logo}
        alt="Loading games"
        style={{ width: 220, height: 70, 
        }}
      />
    );

    const RedirectLinks = () => (
      <>
        <a
          href="https://www.oracleapi.co.uk"
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: 12,
            color: "#10f3c8",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: 0.4,
          }}
        >
          www.oracleapi.co.uk
        </a>
        <a
          href="https://www.oracleapi.co.uk"
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: 6,
            color: "#ffffff",
            opacity: 0.85,
            textDecoration: "none",
          }}
        >
          গেম চালু হচ্ছে ...
        </a>
      </>
    );

    if (!loaderEnabled) {
      return (
        <div
          style={{
            height: "100vh",
            background: "#000",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            textAlign: "center",
          }}
        >
          {logoElement}
          <BarLoader color="#10f3c8" width={220} height={6} cssOverride={{ marginTop: 12 }} />
          <RedirectLinks />
        </div>
      );
    }

    return (
      <div
        style={{
          height: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 8,
        }}
      >
        {logoElement}
        <BarLoader color="#10f3c8" width={180} height={6} cssOverride={{ marginTop: 16 }} />
        <RedirectLinks />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#0b0b0b",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ fontSize: "22px", fontWeight: 700 }}>Oracle Technology LLC</div>
        <div style={{ marginTop: 6, opacity: 0.8 }}>www.oracleapi.net</div>
        <div style={{ marginTop: 24, fontSize: 18 }}>{errorMsg}</div>
      </div>
    );
  }

  // গেম লোড হলে Full Screen iframe
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        zIndex: 9999,
      }}
    >
      <iframe
        src={gameUrl}
        style={{ width: "100%", height: "100%", border: 0 }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PlayGame;
