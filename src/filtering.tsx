import React, { useEffect, useRef, useState } from "react";
import {
  ButtonGroup,
  Dropdown as ReactBootstrapDropdown,
  DropdownButton,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { Dropdown } from "bootstrap";
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

function initBootstrapDropdown(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }
  const dropdown = new Dropdown(element);
  return dropdown;
}

export const SelectFilter = ({
  filterDefinition,
  filter,
  setFilter,
  props,
}: FilterProps<SelectFilterState, SelectFilterDef>) => {
  const isMulti = filterDefinition.isMulti;

  const currentValue =
    filter?.value instanceof Array ? filter?.value : [filter?.value];
  const activeOptions = filterDefinition.options.filter((option) =>
    currentValue.includes(option.value)
  );
  const id = `tableus-filter-${filterDefinition.key}`;

  const elementRef = useRef(initBootstrapDropdown(id));

  useEffect(() => {
    elementRef.current = initBootstrapDropdown(id);
  }, [id]);

  const openDropdown = () => {
    if (!elementRef.current) {
      return;
    }
    elementRef.current.show();
  };
  const closeDropdown = () => {
    if (!elementRef.current) {
      return;
    }
    elementRef.current.hide();
  };

  return (
    <div className="btn-group" role="group">
      <button
        className={
          "btn btn-secondary dropdown-toggle" +
          (activeOptions.length > 0 ? " active" : "")
        }
        type="button"
        id={id}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={openDropdown}
      >
        {filterDefinition.label}
      </button>
      <ul className="dropdown-menu" aria-labelledby={id}>
        {filterDefinition.options.map((option) => {
          const isActive = activeOptions.includes(option);

          const toggleFilter = () => {
            if (isMulti) {
              setFilter((prev) => {
                if (isActive) {
                  if (!(prev instanceof Array)) {
                    throw new Error("Expected array");
                  }
                  return prev.filter((o) => o !== option.value);
                }
                return [...(prev ? prev : []), option.value];
              });
            } else {
              setFilter(option.value);
            }
          };

          const handleClick = () => {
            toggleFilter();
            closeDropdown();
          };

          return (
            <ReactBootstrapDropdown.Item
              active={isActive}
              key={option.value}
              onClick={handleClick}
            >
              {option.label}
            </ReactBootstrapDropdown.Item>
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
            onClick={() => {
              setFilter(isMulti ? [] : "");
              closeDropdown();
            }}
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
