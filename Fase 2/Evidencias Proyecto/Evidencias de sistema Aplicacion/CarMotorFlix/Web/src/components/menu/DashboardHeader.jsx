import PropTypes from 'prop-types';
import { Button } from "../ui/nadvar/button"; 
import { Menu } from "lucide-react";

export default function DashboardHeader({ toggleSidebar }) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          {/* Asegúrate de que el botón esté llamando correctamente a toggleSidebar */}
          <Button variant="ghost" size="sm" className="mr-2 md:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">CarMotorFix</h1>
        </div>
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
};
