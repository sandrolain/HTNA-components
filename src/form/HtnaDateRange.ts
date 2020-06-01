import { create, AttributeTypes } from "htna";
import { setDate, setTime, minDate, maxDate, boundDate, dateString, timeString, timeFrom, dateFrom } from "htna-tools/dist/esm/date";

const defaultMin = new Date();
const defaultMax = new Date();

setDate(defaultMin, [1900, 1, 1]);
setTime(defaultMin, [0, 0, 0, 0]);

setDate(defaultMax, [2999, 12, 31]);
setTime(defaultMax, [23, 59, 59, 999]);


export const HtnaDateRange = create({
  elementName: "htna-date-range",
  render: () => /*html*/`<div id="range">
<div class="row" id="from">
  <label for="from"><slot name="from"></slot></label>
  <div class="row-date"><input id="from-date" type="date" placeholder="YYYY-MM-DD" pattern="^[0-9]{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$" id="from-date-fld" /></div>
  <div class="row-time"><input id="from-time" type="time" placeholder="HH:MM" pattern="^[0-2][0-9]:[0-5][0-9]$" id="from-time-fld" /></div>
</div>
<div class="row" id="to">
  <label for="to"><slot name="to"></slot></label>
  <div class="row-date"><input id="to-date" type="date" placeholder="YYYY-MM-DD" pattern="^[0-9]{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$" id="from-date-fld" /></div>
  <div class="row-time"><input id="to-time" type="time" placeholder="HH:MM" pattern="^[0-2][0-9]:[0-5][0-9]$" id="from-time-fld" /></div>
</div>
</div>`,
  style: /*css*/`
#range {
  height: 1em;
  position: relative;
}
.row {
  width: 100%;
  display: flex;
}
label {
  width: 50px;
}
input {
  flex: 1;
}
output {
  width: 50px;
  text-align: right;
}
  `,
  attributesSchema: {
    "min": {
      type: AttributeTypes.Date,
      observed: true,
      property: true,
      value: defaultMin
    },
    "max": {
      type: AttributeTypes.Date,
      observed: true,
      property: true,
      value: defaultMax
    },
    // TODO: min-time
    // TODO: max-time
    "value": {
      type: AttributeTypes.CSVDate,
      observed: true,
      property: true,
      value: [new Date(), new Date()]
    }
  },
  controller: ({ light, shadow, attributes }) => {

    const $fromDate  = shadow.$<HTMLInputElement>("#from-date");
    const $fromTime  = shadow.$<HTMLInputElement>("#from-time");
    const $toDate    = shadow.$<HTMLInputElement>("#to-date");
    const $toTime    = shadow.$<HTMLInputElement>("#to-time");

    const updateValue = function (source: string = "from"): void {
      const value         = attributes.get("value") as [Date, Date];
      const min           = attributes.get("min") as Date;
      const max           = attributes.get("max") as Date;
      const valueFromDate = dateFrom($fromDate.value);
      const valueFromTime = timeFrom($fromTime.value);
      const valueToDate   = dateFrom($toDate.value);
      const valueToTime   = timeFrom($toTime.value);

      const valueFrom     = setTime(valueFromDate, valueFromTime);
      const valueTo       = setTime(valueToDate, valueToTime);

      let newValueFrom    = boundDate(valueFrom, min, max);
      let newValueTo      = boundDate(valueTo, min, max);

      if(source === "to") {
        newValueFrom = minDate(newValueFrom, newValueTo);
      } else {
        newValueTo   = maxDate(newValueFrom, newValueTo);
      }

      if(newValueFrom.getTime() !== valueFrom.getTime()) {
        $fromDate.value = dateString(newValueFrom);
        $fromTime.value = timeString(newValueFrom);
      }

      if(newValueTo.getTime() !== valueTo.getTime()) {
        $toDate.value = dateString(newValueTo);
        $toTime.value = timeString(newValueTo);
      }

      if(value[0].getTime() !== newValueFrom.getTime() || value[1].getTime() !== newValueTo.getTime()) {
        attributes.set("value", [newValueFrom, newValueTo]);
        light.dispatch("change");
      }
    };

    const setNewValue = (): void => {
      const value = attributes.get("value") as [Date, Date];
      if(value) {
        $fromDate.value = dateString(value[0]);
        $fromTime.value = timeString(value[0]);
        $toDate.value   = dateString(value[1]);
        $toTime.value   = timeString(value[1]);
      }
    };

    const updateAttributes = function (): void {
      const step = attributes.get("step") as number;
      $fromTime.step = (step || 60).toString();
      $toTime.step   = (step || 60).toString();

      updateValue();
    };

    $fromDate.addEventListener("input", () => {
      updateValue("from");
    });
    $fromTime.addEventListener("input", () => {
      updateValue("from");
    });
    $toDate.addEventListener("input", () => {
      updateValue("to");
    });
    $toTime.addEventListener("input", () => {
      updateValue("to");
    });

    return {
      connectedCallback: (): void => {
        setNewValue();
        updateAttributes();
      },
      attributeChangedCallback: {
        "step": updateAttributes,
        "min": updateAttributes,
        "max": updateAttributes,
        "value": (): void => {
          setNewValue();
          updateValue();
        }
      }
    };
  }
});

export default HtnaDateRange;
