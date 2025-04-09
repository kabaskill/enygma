"use client";
import EnigmaComponent from "../_components/Enigma/EnigmaComponent";
import Footer from "../_components/Footer";
import Header from "../_components/Hero";

export default function Classic() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-6xl flex-grow px-4">
        <EnigmaComponent />
      </main>
      <Footer />
    </div>
  );
}
