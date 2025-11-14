import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <main className="ml-52 mt-16 p-8 bg-gray-50 min-h-screen">{children}</main>
    </div>
  )
}

export default Layout
