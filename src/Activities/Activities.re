type todosRecord = {
  id: string,
  title: string,
  description: string,
};

let containerStyle =
  ReactDOMRe.Style.make(
    ~border="1px solid #48a9dc",
    ~borderRadius="12px",
    ~paddingLeft="12px",
    ~paddingRight="12px",
    ~marginTop="12px",
    ~display="flex",
    ~alignItems="center",
    ~justifyContent="space-between",
    (),
  );

let buttonGroupStyle =
  ReactDOMRe.Style.make(
    ~display="flex",
    ~alignItems="center",
    ~justifyContent="space-between",
    (),
  );

let deleteButtonStyle =
  ReactDOMRe.Style.make(
    ~background="red",
    ~marginLeft="8px",
    ~color="white",
    ~borderRadius="6px",
    (),
  );

let grupInputStyle =
  ReactDOMRe.Style.make(
    ~display="flex",
    ~flexDirection="column",
    ~alignItems="center",
    ~justifyContent="center",
    (),
  );

let editButtonStyle =
  ReactDOMRe.Style.make(
    ~background="#48a9dc",
    ~color="white",
    ~borderRadius="4px",
    (),
  );

let inputStyle = ReactDOMRe.Style.make(~margin="12px", ());

type activityKind =
  | Showing
  | Editing;

[@react.component]
let make =
    (
      ~todosData: todosRecord,
      ~onDeleteTodos: string => unit,
      ~onEditTodos:
         (~todoId: string, ~editedTitle: string, ~editedDescription: string) =>
         unit,
    ) => {
  let (kind, setKind) = React.useState(() => Showing);
  let (activityValue, setActivityValue) = React.useState(() => "");
  let (descriptionValue, setDescriptionValue) = React.useState(() => "");

  <div style=containerStyle key={todosData.id}>
    {switch (kind) {
     | Showing =>
       <>
         <div>
           <h2> {React.string(todosData.title)} </h2>
           <p> {React.string(todosData.description)} </p>
         </div>
         <div style=buttonGroupStyle>
           <button
             style=editButtonStyle
             onClick={_ => {
               setKind(_ => Editing);
               setDescriptionValue(_ => todosData.description);
               setActivityValue(_ => todosData.title);
             }}>
             {React.string("Edit")}
           </button>
           <button
             style=deleteButtonStyle
             onClick={_event => onDeleteTodos(todosData.id)}>
             {React.string("Delete")}
           </button>
         </div>
       </>
     | Editing =>
       <>
         <div style=grupInputStyle>
           <input
             value=activityValue
             style=inputStyle
             onChange={event => {
               let value = event->ReactEvent.Form.target##value;
               setActivityValue(value);
             }}
           />
           <input
             value=descriptionValue
             style=inputStyle
             onChange={event => {
               let value = event->ReactEvent.Form.target##value;
               setDescriptionValue(value);
             }}
           />
         </div>
         <div style=buttonGroupStyle>
           <button
             style=editButtonStyle
             onClick={_ => {
               onEditTodos(
                 ~todoId=todosData.id,
                 ~editedTitle=activityValue,
                 ~editedDescription=descriptionValue,
               );
               setKind(_ => Showing);
             }}>
             {React.string("Submit")}
           </button>
           <button
             style=deleteButtonStyle
             onClick={_event => onDeleteTodos(todosData.id)}>
             {React.string("Delete")}
           </button>
         </div>
       </>
     }}
  </div>;
};
