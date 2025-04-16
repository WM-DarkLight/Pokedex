export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-3 text-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          PokéVault &copy; {new Date().getFullYear()} | Data from{" "}
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary-foreground/80"
          >
            PokéAPI
          </a>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary-foreground/80">
            About
          </a>
          <a href="#" className="hover:text-primary-foreground/80">
            Privacy
          </a>
          <a href="#" className="hover:text-primary-foreground/80">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
