import * as React from "react";
import { useNavigate } from "react-router-dom";
import { minutesToHHMM } from "helpers/hhmm-parser";
import { Pen, Trash } from "phosphor-react";
import { IProject } from "../interface";

export const Project = ({
  id,
  name,
  clientName,
  minutesSpent,
  isBillable,
  isAdminUser,
  setShowProjectModal,
  setEditProjectData,
  setShowDeleteDialog,
  setDeleteProjectData
}: IProject) => {
  const [grayColor, setGrayColor] = React.useState<string>("");
  const [isHover, setHover] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setGrayColor("bg-miru-gray-100");
    setHover(true);
  };

  const handleMouseLeave = () => {
    setGrayColor("");
    setHover(false);
  };
  const projectClickHandler = (id) => {
    navigate(`${id}`);
  };

  return (
    <tr key={id}
      className={`last:border-b-0 ${grayColor}`}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={() => projectClickHandler(id)}
    >
      <td className="table__cell text-base">
        <div className="flex items-center justify-between">
          {name}
        </div>
        <p className="max-h-32 overflow-scroll text-sm text-miru-dark-purple-400 break-words whitespace-pre-wrap">
          {clientName}
        </p>
      </td>
      <td className="table__cell text-center">
        {isBillable ?
          <span className="px-1 tracking-widest rounded-lg text-xs font-semibold leading-4 bg-miru-han-purple-100 text-miru-han-purple-1000">BILLABLE</span>
          : <span className="px-1 tracking-widest rounded-lg text-xs font-semibold leading-4 bg-miru-gray-1000">NON BILLABLE</span>
        }
      </td>
      <td className="table__cell text-xl text-right font-bold">
        {minutesToHHMM(minutesSpent)}
      </td>
      <td className="table__cell px-3 py-3">
        {isAdminUser && isHover && <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowProjectModal(true);
            setEditProjectData({ id, name, clientName, isBillable });
          }}
        >
          <Pen size={16} color="#0033CC" />
        </button>
        }
      </td>
      <td className="table__cell px-3 py-3">
        {isAdminUser && isHover && <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteDialog(true);
            setDeleteProjectData({ id, name });
          }}
        >
          <Trash size={16} color="#0033CC" />
        </button>
        }
      </td>
    </tr>
  );
};
