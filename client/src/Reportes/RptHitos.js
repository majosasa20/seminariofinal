import React, { useEffect, useState } from "react";
import Axios from "axios";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import "react-calendar-timeline/lib/Timeline.css";
import styles from "./RptHitos.module.css";

const RptProyectos = ({ }) => {
  const [proyectos, setProyectos] = useState([]);
  const [timeStart, setTimeStart] = useState(moment().startOf('year').valueOf()); // Inicia desde el inicio del año
  const [timeEnd, setTimeEnd] = useState(moment().endOf('year').valueOf()); // Finaliza en el final del año

  const obtenerProyectos = () => {
    Axios.get("http://localhost:3001/proyectos/getHitos")
      .then((response) => {
        setProyectos(response.data);
        console.log(response);
      })
      .catch((error) => console.error("Error al obtener proyectos:", error));
  };

  useEffect(() => {
    obtenerProyectos();
  }, []);

  const grupos = proyectos.map((proyecto) => ({
    id: proyecto.idProyecto,
    title: proyecto.NombreProyecto,
  }));

  const items = proyectos.map((proyecto) => ({
    id: proyecto.idProyecto,
    group: proyecto.idProyecto,
    title: proyecto.NombreProyecto,
    start_time: moment(proyecto.FechaInicio).valueOf(), 
    end_time: moment(proyecto.FechaFin).valueOf(), 
    itemProps: {
      style: {
        background:
          proyecto.CodEstadoProyecto = 1
            ? "green"
            : proyecto.CodEstadoProyecto = 2
            ? "blue"
            : "red",
        color: "white",
      },
    },
}));


  const handlePrevious = () => {
    setTimeStart((prev) => moment(prev).subtract(1, "month").valueOf());
    setTimeEnd((prev) => moment(prev).subtract(1, "month").valueOf());
  };

  const handleNext = () => {
    setTimeStart((prev) => moment(prev).add(1, "month").valueOf());
    setTimeEnd((prev) => moment(prev).add(1, "month").valueOf());
  };

  return (
    <div className="reporte">
      <h2 className={styles.titulo}>Cronograma de Proyectos</h2>
      <div className={styles.timeline}>
        <div className={styles.navButtons}>
          <button onClick={handlePrevious}>⬅️</button>
          <button onClick={handleNext}>➡️</button>
        </div>
        <Timeline
          groups={grupos}
          items={items}
          visibleTimeStart={timeStart}
          visibleTimeEnd={timeEnd}
          lineHeight={60}
          itemHeightRatio={0.75}
          stackItems={false}
          canMove={false}
          canResize={false}
        //   onItemClick={(itemId) => {
        //     const proyectoSeleccionado = proyectos.find((p) => p.idProyecto === itemId);
        //     if (proyectoSeleccionado) {
        //       setProyectoData(proyectoSeleccionado);
        //       toggleModal();
        //     }
        //   }}
        />
      </div>
    </div>
  );
};

export default RptProyectos;
