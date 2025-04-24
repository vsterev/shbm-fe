import React, { useState, useEffect, useMemo } from "react";
import HotelCreateVariant from "./HotelCreateVariant";
import styles from "../styles/AccommodationsMap.module.css";
import appCookie from "../../utils/appCookie";
import {
  Board,
  AccommodationMapping,
  Room,
} from "../../interfaces/hotel.interface";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useIntegrationContext } from "../../contexts/integration.context";
import AccommodationService from "../../services/accommodation";

interface HotelInfoProps {
  selectedHotelId: number | undefined;
}

const HotelInfo = ({ selectedHotelId }: HotelInfoProps) => {
  const token = appCookie("hbs-token");

  const [accommodationsMap, setAccommodationsMap] =
    useState<AccommodationMapping>({} as AccommodationMapping);
  const [refresh, setRefresh] = useState<boolean>(false);

  const { selectedIntegration } = useIntegrationContext();

  const apiCode = selectedIntegration?.code as string as
    | keyof AccommodationMapping["boards"]
    | keyof AccommodationMapping["rooms"];

  useEffect(() => {
    if (!selectedHotelId) {
      return;
    }
    if (!selectedIntegration) {
      return;
    }
    setAccommodationsMap({} as AccommodationMapping);
    AccommodationService.get(
      { ilCode: selectedHotelId, integrationName: selectedIntegration.name },
      token,
    )
      .then((r) => {
        if ("error" in r) {
          return;
        }
        setAccommodationsMap(r);
        setRefresh(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotelId, refresh]);

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    el: number | string,
  ) => {
    if (!selectedIntegration) {
      return;
    }
    const { name, value } = e.target as HTMLInputElement;
    const typedName = name as "rooms" | "boards";
    const index = name === "boards" ? Number(el) : String(el);

    // Create a copy of the accommodationsMap for the specific type (boards or rooms)
    const temp = { ...accommodationsMap[typedName] };

    // Ensure temp[index] exists
    if (!temp[index]) {
      temp[index] = {} as (typeof temp)[keyof typeof temp];
    }

    temp[index][apiCode as keyof (typeof temp)[keyof typeof temp]] = value;

    setAccommodationsMap({ ...accommodationsMap, [name]: temp });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedIntegration) {
      return;
    }

    await AccommodationService.edit(
      {
        hotelId: accommodationsMap._id,
        boards: accommodationsMap.boards,
        rooms: accommodationsMap.rooms,
        integrationName: selectedIntegration.name,
      },
      token,
    )
      .then(() => {
        toast.success("Mapping was saved");
      })
      .catch((error) => console.log(error));
  };

  const deleteHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      window.confirm(
        `Confirm delete of ${accommodationsMap.hotelName}, all mappings also will be deleted`,
      )
    ) {
      AccommodationService.delete(accommodationsMap?._id, token).then(() => {
        setAccommodationsMap(() => ({}) as AccommodationMapping);
      });
    }
  };

  const activateCreateVariants = useMemo(() => {
    return !Object.keys(accommodationsMap).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accommodationsMap, selectedHotelId]);

  if (!selectedHotelId) {
    return null;
  }

  if (!accommodationsMap) {
    return (
      <ReactLoading type="bubbles" color="blue" height={100} width={100} />
    );
  }

  if (!selectedIntegration) {
    return null;
  }

  return (
    <>
      <div className={styles.accomElements}>
        <h3>hotel Interlook information for {accommodationsMap.hotelName}:</h3>
        {activateCreateVariants ? (
          <div>
            <div>
              <HotelCreateVariant
                selectedHotelId={selectedHotelId}
                setRefresh={setRefresh}
              />
            </div>
          </div>
        ) : (
          <div>
            <h4>boards:</h4>
            <form onSubmit={submitHandler}>
              {accommodationsMap?.boards &&
                Object.keys(accommodationsMap?.boards).map(
                  (boardCode: string) => {
                    return (
                      <div key={boardCode}>
                        {accommodationsMap?.boards[Number(boardCode)]?.boardId},{" "}
                        {
                          accommodationsMap?.boards[Number(boardCode)]
                            ?.boardName
                        }{" "}
                        <input
                          type="text"
                          value={
                            accommodationsMap?.boards[Number(boardCode)]?.[
                              apiCode as keyof Board
                            ] || ""
                          }
                          name="boards"
                          onChange={(e) => changeHandler(e, boardCode)}
                        />
                      </div>
                    );
                  },
                )}
              <h4>rooms:</h4>
              {accommodationsMap?.rooms &&
                Object.keys(accommodationsMap?.rooms).map((el) => {
                  return (
                    <div key={el}>
                      {el}, {accommodationsMap.rooms[el].roomTypeName}{" "}
                      {accommodationsMap.rooms[el].roomCategoryName}
                      <input
                        type="text"
                        value={
                          accommodationsMap.rooms[el]?.[
                            apiCode as keyof Room
                          ] || ""
                        }
                        name="rooms"
                        onChange={(e) => changeHandler(e, el)}
                        style={{
                          minWidth: `${typeof accommodationsMap.rooms[el]?.[apiCode as keyof Room] === "string" ? (accommodationsMap.rooms[el]?.[apiCode as keyof Room] as string).length + 5 : "auto"}ch`,
                        }}
                      />
                    </div>
                  );
                })}
              <button className={styles.submitButton}>Submit</button>
              <button className={styles.deleteButton} onClick={deleteHandler}>
                Delete
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default HotelInfo;
