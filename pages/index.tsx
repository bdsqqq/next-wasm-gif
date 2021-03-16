const ffmpeg = createFFmpeg({ log: true });

export default function Home() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<File | null | undefined>();
  const [gif, setGif] = useState<string | undefined>();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    // if the video exists, write the file to memory
    video && ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run("-i", "test.mp4", "-t", "2", "-f", "gif", "out.gif");

    // Read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);
  };

  function reset() {
    setGif(undefined);
    setVideo(undefined);
  }

  return (
    <Container>
      <AnimatePresence exitBeforeEnter>
        {!ready ? (
          <Band key="band00" gridless id="loading">
            Loading
          </Band>
        ) : !video ? (
          <Band
            key="band01"
            headline={{ bold: "01", thin: "Upload your video" }}
          >
            <div className="border border-dashed border-gray-500 relative">
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
        ) : !gif ? (
          <Band key="band02" headline={{ bold: "02", thin: "Preview it" }}>
            <div className="flex">
              <div className="w-2/3 h-auto">
                {video && (
                  <video
                    controls
                    width="100%"
                    src={URL.createObjectURL(video)}
                  />
                )}
              </div>
              <div className="flex flex-col justify-between items-center w-1/3">
                <button onClick={convertToGif}>Convert</button>

                <button onClick={reset}>Hej do</button>
              </div>
            </div>
          </Band>
        ) : (
          <Band key="band03" headline={{ bold: "03", thin: "Done!" }}>
            <div className="w-full h-auto">
              <div className="flex">
                <div>
                  <img src={gif} width="100%" />
                </div>
                <div className="flex flex-col justify-between items-center w-1/3">
                  <a href={gif} download="hej">
                    Download
                  </a>

                  <button onClick={reset}>Hej do</button>
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
