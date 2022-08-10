import React, { useEffect, useState } from "react";
import {
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { FilterProps } from "@tableus/core/dist/context";
import {
  CheckFilterDef,
  CheckFilterState,
  SearchFilterDef,
  SearchFilterState,
  SelectFilterDef,
  SelectFilterState,
} from "@tableus/core/dist/filtering";
import { useDebouncedCallback } from "@tableus/core/dist/helpers";

export const SelectFilter = ({
  filterDefinition,
  filter,
  setFilter,
  props,
}: FilterProps<SelectFilterState, SelectFilterDef>) => {
  const isMulti = filterDefinition.isMulti;
  const activeOptions = filterDefinition.options.filter((option) =>
    isMulti
      ? (filter?.value as string[] | undefined)?.includes(option.value)
      : filter?.value === option.value
  );
  const id = `tableus-filter-${filterDefinition.key}`;

  return (
    <div className="dropdown">
      <button
        className={
          "btn btn-secondary dropdown-toggle" +
          (activeOptions.length > 0 ? " active" : "")
        }
        type="button"
        id={id}
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Dropdown button
      </button>
      <ul className="dropdown-menu" aria-labelledby={id}>
        {filterDefinition.options.map((option) => {
          const isActive = activeOptions.includes(option);
          const handleClick = () => {
            if (!isMulti) {
              setFilter(option.value);
              return;
            }
            setFilter((prev) =>
              isActive
                ? (prev as string[]).filter((o) => o !== option.value)
                : [...(prev ? prev : []), option.value]
            );
          };

          const className = "dropdown-item" + (isActive ? " active" : "");
          return (
            <li>
              <a
                className={className}
                href="#"
                onClick={handleClick}
                key={option.value}
              >
                {option.label}
              </a>
            </li>
          );
        })}
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a
            className={
              "dropdown-item" + (activeOptions.length === 0 ? " active" : "")
            }
            href="#"
            onClick={() => setFilter(isMulti ? [] : "")}
          >
            Keine Filterung
          </a>
        </li>
      </ul>
    </div>
  );
};

export const SearchFilter = ({
  filterDefinition,
  filter,
  setFilter,
  props,
}: FilterProps<SearchFilterState, SearchFilterDef>) => {
  const [value, setValue] = useState(
    filter?.value ?? filterDefinition.defaultValue ?? ""
  );
  const debouncedSetFilter = useDebouncedCallback(setFilter, 500);
  useEffect(() => {
    debouncedSetFilter(value);
  }, [value]);

  return (
    <InputGroup {...props}>
      <InputGroup.Text>{filterDefinition.label}</InputGroup.Text>
      <FormControl
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={filterDefinition.placeholder}
      />
    </InputGroup>
  );
};

export const CheckFilter = ({
  filterDefinition,
  filter,
  setFilter,
  props,
}: FilterProps<CheckFilterState, CheckFilterDef>) => {
  return (
    <Form.Group controlId={filterDefinition.key} {...props}>
      <Form.Check
        type="checkbox"
        label={filterDefinition.label}
        onChange={() => setFilter(!filter?.value)}
        checked={filter?.value ?? filterDefinition.defaultValue ?? false}
      />
    </Form.Group>
  );
};
