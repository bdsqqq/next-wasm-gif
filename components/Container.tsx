const Container: React.FC = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-igor-light">
      <div className="relative -mt-2 bg-igor-light min-h-30vh rounded-tl-2xl w-full">
        <main className="flex flex-col justify-center">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Container;

import Footer from "./Footer";
