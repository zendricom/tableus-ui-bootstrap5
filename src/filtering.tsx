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

  return (
    <DropdownButton
      title={filterDefinition.label}
      variant="secondary"
      as={ButtonGroup}
      {...props}
    >
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

        return (
          <Dropdown.Item
            active={isActive}
            key={option.value}
            onClick={handleClick}
          >
            {option.label}
          </Dropdown.Item>
        );
      })}

      <Dropdown.Divider />
      <Dropdown.Item
        onClick={() => setFilter(isMulti ? [] : "")}
        active={activeOptions.length === 0}
      >
        Keine Filterung
      </Dropdown.Item>
    </DropdownButton>
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
