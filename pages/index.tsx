const ffmpeg = createFFmpeg({ log: true });

export default function Home() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<File | null | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [gif, setGif] = useState<string | undefined>();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const IS_COMPATIBLE = typeof SharedArrayBuffer === "function";

  useEffect(() => {
    IS_COMPATIBLE && load();
  }, []);

  const convertToGif = async () => {
    setIsProcessing(true);
    // if the video exists, write the file to memory
    video && ffmpeg.FS("writeFile", "file", await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run("-i", "file", "-t", "2", "-f", "gif", "out.gif");

    // Read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);
    setIsProcessing(false);
  };

  function reset() {
    setIsProcessing(false);
    setGif(undefined);
    setVideo(undefined);
  }

  return (
    <Container>
      <AnimatePresence exitBeforeEnter>
        {!IS_COMPATIBLE ? (
          <Band key="band00" gridless id="supports">
            <p className="text-2xl">
              Unfortunatelly your browser doesn't support a feature that is
              crucial for this app.
              <br />
              <br />
              We recommend using the latest desktop version of Firefox or Chrome
            </p>
          </Band>
        ) : !video ? (
          <Band
            key="band01"
            headline={{ bold: "01", thin: "Upload your video" }}
          >
            <div className="border border-dashed border-igor-500 relative">
              <input
                type="file"
                onChange={(e) => setVideo(e.target.files?.item(0))}
                className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"
              />
              <div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">
                <h4>
                  Drop a video anywhere to upload
                  <br />
                  or
                </h4>
                <p className="">Select Files</p>
              </div>
            </div>
          </Band>
        ) : !ready ? (
          <Band key="band00" gridless id="loading">
            Loading
          </Band>
        ) : !gif ? (
          <Band key="band02" headline={{ bold: "02", thin: "Preview it" }}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 h-auto">
                {video && (
                  <video
                    controls
                    width="100%"
                    src={URL.createObjectURL(video)}
                  />
                )}
              </div>
              <div className="flex flex-row-reverse md:flex-col justify-between items-start py-4 md:py-0 md:px-6 md:w-1/3">
                <button className="btn text-lg" onClick={convertToGif}>
                  Convert it!
                </button>

                <button className="btn" onClick={reset}>
                  ⟵ Go back
                </button>
              </div>
            </div>
          </Band>
        ) : isProcessing ? (
          <Band key="band00" gridless id="loading">
            Loading
          </Band>
        ) : (
          <Band key="band03" headline={{ bold: "03", thin: "Done!" }}>
            <div className="w-full h-auto">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 h-auto">
                  <img src={gif} width="100%" />
                </div>
                <div className="flex flex-row-reverse md:flex-col justify-between items-start py-4 md:py-0 md:px-6 md:w-1/3">
                  <a className="btn text-lg" href={gif} download="hej">
                    Download it!
                  </a>

                  <button className="btn" onClick={reset}>
                    Convert another video! <span>⭯</span>
                  </button>
                </div>
              </div>
            </div>
          </Band>
        )}
      </AnimatePresence>
    </Container>
  );
}

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Container from "../components/Container";
import Band from "../components/Band";
